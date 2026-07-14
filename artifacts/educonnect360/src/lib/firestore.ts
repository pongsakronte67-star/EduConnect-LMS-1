/**
 * Firestore data-access layer for EduConnect360.
 *
 * All reads/writes for users, classes, sessions, and attendance live here
 * so pages never talk to the Firestore SDK directly.
 */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Attendance,
  Class,
  ClassCover,
  ClassSession,
  User,
  UserRole,
} from "@/types";

function requireDb() {
  if (!db) {
    throw new Error(
      "Firestore is not available -- Firebase is not configured. Check your VITE_FIREBASE_* environment variables.",
    );
  }
  return db;
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function tsToISO(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  role: UserRole,
): Promise<User> {
  const database = requireDb();
  const ref = doc(database, "users", uid);
  await setDoc(ref, {
    uid,
    email,
    displayName,
    role,
    photoURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return {
    id: uid,
    uid,
    email,
    displayName,
    role,
    photoURL: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const database = requireDb();
  const snap = await getDoc(doc(database, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    photoURL: data.photoURL ?? null,
    createdAt: tsToISO(data.createdAt),
    updatedAt: tsToISO(data.updatedAt),
  };
}

/* ------------------------------------------------------------------ */
/* Classes                                                             */
/* ------------------------------------------------------------------ */

function generateJoinCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function mapClassDoc(id: string, data: Record<string, unknown>): Class {
  return {
    id,
    name: data.name as string,
    gradeLevel: data.gradeLevel as string,
    cover: data.cover as ClassCover,
    teacherId: data.teacherId as string,
    teacherName: data.teacherName as string,
    joinCode: data.joinCode as string,
    studentIds: (data.studentIds as string[]) ?? [],
    createdAt: tsToISO(data.createdAt),
    updatedAt: tsToISO(data.updatedAt),
  };
}

export async function createClass(input: {
  name: string;
  gradeLevel: string;
  cover: ClassCover;
  teacherId: string;
  teacherName: string;
}): Promise<Class> {
  const database = requireDb();

  // Regenerate on the rare chance of a collision against active codes.
  let joinCode = generateJoinCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getDocs(
      query(collection(database, "classes"), where("joinCode", "==", joinCode)),
    );
    if (existing.empty) break;
    joinCode = generateJoinCode();
  }

  const ref = await addDoc(collection(database, "classes"), {
    name: input.name,
    gradeLevel: input.gradeLevel,
    cover: input.cover,
    teacherId: input.teacherId,
    teacherName: input.teacherName,
    joinCode,
    studentIds: [] as string[],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const snap = await getDoc(ref);
  return mapClassDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function getClassesForTeacher(teacherId: string): Promise<Class[]> {
  const database = requireDb();
  const snaps = await getDocs(
    query(collection(database, "classes"), where("teacherId", "==", teacherId)),
  );
  return snaps.docs.map((d) => mapClassDoc(d.id, d.data()));
}

export async function getClassesForStudent(studentId: string): Promise<Class[]> {
  const database = requireDb();
  const snaps = await getDocs(
    query(
      collection(database, "classes"),
      where("studentIds", "array-contains", studentId),
    ),
  );
  return snaps.docs.map((d) => mapClassDoc(d.id, d.data()));
}

export async function getClassById(classId: string): Promise<Class | null> {
  const database = requireDb();
  const snap = await getDoc(doc(database, "classes", classId));
  if (!snap.exists()) return null;
  return mapClassDoc(snap.id, snap.data());
}

export async function joinClassByCode(
  joinCode: string,
  studentId: string,
): Promise<Class> {
  const database = requireDb();
  const snaps = await getDocs(
    query(collection(database, "classes"), where("joinCode", "==", joinCode.trim())),
  );
  if (snaps.empty) {
    throw new Error("ไม่พบห้องเรียนที่ใช้รหัสนี้ กรุณาตรวจสอบรหัสอีกครั้ง");
  }
  const classDoc = snaps.docs[0];
  const existing = mapClassDoc(classDoc.id, classDoc.data());
  if (existing.studentIds.includes(studentId)) {
    return existing;
  }
  await updateDoc(classDoc.ref, {
    studentIds: [...existing.studentIds, studentId],
    updatedAt: serverTimestamp(),
  });
  return { ...existing, studentIds: [...existing.studentIds, studentId] };
}

/* ------------------------------------------------------------------ */
/* Sessions (attendance-taking events)                                 */
/* ------------------------------------------------------------------ */

function mapSessionDoc(id: string, data: Record<string, unknown>): ClassSession {
  return {
    id,
    classId: data.classId as string,
    teacherId: data.teacherId as string,
    date: data.date as string,
    active: Boolean(data.active),
    createdAt: tsToISO(data.createdAt),
  };
}

/** Returns today's session for a class, creating one if it doesn't exist yet. */
export async function getOrCreateTodaySession(
  classId: string,
  teacherId: string,
): Promise<ClassSession> {
  const database = requireDb();
  const date = todayISODate();
  const existing = await getDocs(
    query(
      collection(database, "sessions"),
      where("classId", "==", classId),
      where("date", "==", date),
    ),
  );
  if (!existing.empty) {
    const d = existing.docs[0];
    return mapSessionDoc(d.id, d.data());
  }
  const ref = await addDoc(collection(database, "sessions"), {
    classId,
    teacherId,
    date,
    active: true,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return mapSessionDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function getTodaySessionForClass(
  classId: string,
): Promise<ClassSession | null> {
  const database = requireDb();
  const date = todayISODate();
  const snaps = await getDocs(
    query(
      collection(database, "sessions"),
      where("classId", "==", classId),
      where("date", "==", date),
    ),
  );
  if (snaps.empty) return null;
  const d = snaps.docs[0];
  return mapSessionDoc(d.id, d.data());
}

/* ------------------------------------------------------------------ */
/* Attendance                                                          */
/* ------------------------------------------------------------------ */

function mapAttendanceDoc(id: string, data: Record<string, unknown>): Attendance {
  return {
    id,
    classId: data.classId as string,
    sessionId: data.sessionId as string,
    studentId: data.studentId as string,
    studentName: data.studentName as string,
    date: data.date as string,
    status: data.status as Attendance["status"],
    checkedInAt: tsToISO(data.checkedInAt),
  };
}

/** Records a student's check-in for a session. No-ops if already checked in. */
export async function recordAttendance(input: {
  classId: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  date: string;
}): Promise<{ alreadyCheckedIn: boolean }> {
  const database = requireDb();
  const existing = await getDocs(
    query(
      collection(database, "attendance"),
      where("sessionId", "==", input.sessionId),
      where("studentId", "==", input.studentId),
    ),
  );
  if (!existing.empty) {
    return { alreadyCheckedIn: true };
  }
  await addDoc(collection(database, "attendance"), {
    classId: input.classId,
    sessionId: input.sessionId,
    studentId: input.studentId,
    studentName: input.studentName,
    date: input.date,
    status: "present",
    checkedInAt: serverTimestamp(),
  });
  return { alreadyCheckedIn: false };
}

export async function hasStudentCheckedIn(
  sessionId: string,
  studentId: string,
): Promise<boolean> {
  const database = requireDb();
  const snaps = await getDocs(
    query(
      collection(database, "attendance"),
      where("sessionId", "==", sessionId),
      where("studentId", "==", studentId),
    ),
  );
  return !snaps.empty;
}

/** Live count of check-ins for a session (used for the teacher's real-time dashboard). */
export function subscribeSessionAttendance(
  sessionId: string,
  callback: (records: Attendance[]) => void,
): Unsubscribe {
  const database = requireDb();
  const q = query(
    collection(database, "attendance"),
    where("sessionId", "==", sessionId),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => mapAttendanceDoc(d.id, d.data())));
  });
}

/** Historical attendance rate for a class: total check-ins / (sessions * roster size). */
export async function getClassAttendanceRate(
  classId: string,
  rosterSize: number,
): Promise<{ rate: number; totalSessions: number; totalCheckins: number }> {
  const database = requireDb();
  const [sessionsSnap, attendanceSnap] = await Promise.all([
    getDocs(query(collection(database, "sessions"), where("classId", "==", classId))),
    getDocs(query(collection(database, "attendance"), where("classId", "==", classId))),
  ]);
  const totalSessions = sessionsSnap.size;
  const totalCheckins = attendanceSnap.size;
  const possible = totalSessions * rosterSize;
  const rate = possible > 0 ? Math.round((totalCheckins / possible) * 100) : 0;
  return { rate, totalSessions, totalCheckins };
}
