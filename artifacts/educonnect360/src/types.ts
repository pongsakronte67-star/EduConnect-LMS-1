/**
 * Shared domain types for EduConnect360.
 *
 * These mirror the core Firestore collections the LMS uses:
 * `users`, `classes`, `sessions`, and `attendance`.
 */

/** Role a user account can hold within the platform. */
export type UserRole = "teacher" | "student";

/** A platform account, stored in the `users` Firestore collection (doc id = Firebase Auth uid). */
export interface User {
  id: string;
  uid: string; // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** Preset accent covers for classes -- avoids requiring a real file upload for the MVP. */
export type ClassCover =
  | "emerald"
  | "teal"
  | "lime"
  | "forest"
  | "mint"
  | "moss";

/** A class/course, stored in the `classes` Firestore collection. */
export interface Class {
  id: string;
  name: string; // subject name, e.g. "Algebra II"
  gradeLevel: string; // e.g. "Grade 10"
  cover: ClassCover;
  teacherId: string; // References User.id / uid
  teacherName: string;
  joinCode: string; // 6-digit code students use to join
  studentIds: string[]; // References User.id (students)
  createdAt: string;
  updatedAt: string;
}

/** An attendance-taking session for a class on a given day. */
export interface ClassSession {
  id: string;
  classId: string;
  teacherId: string;
  date: string; // ISO date, e.g. "2026-07-14"
  createdAt: string;
  active: boolean;
}

/** Attendance status for a single student check-in. */
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

/** An attendance record, stored in the `attendance` Firestore collection. */
export interface Attendance {
  id: string;
  classId: string;
  sessionId: string;
  studentId: string; // References User.id
  studentName: string;
  date: string; // ISO date, matches the session's date
  status: AttendanceStatus;
  checkedInAt: string; // ISO timestamp
}
