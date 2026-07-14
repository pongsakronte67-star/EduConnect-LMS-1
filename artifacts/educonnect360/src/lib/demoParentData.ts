// Static seed data for the Parent Portal demo/presentation flow.
// This view is explicitly a presentation demo (per product request) and is
// intentionally decoupled from Firebase Auth/Firestore — there is no parent
// role in the data model yet, so this renders a fixed example student.

export type HomeworkStatus = "submitted" | "pending" | "late";

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: HomeworkStatus;
}

export const demoChild = {
  name: "ด.ญ. พิมพ์ชนก ใจดี",
  nickname: "น้องพิม",
  initials: "พ",
  gradeLevel: "ประถมศึกษาปีที่ 5/2",
  className: "คณิตศาสตร์พื้นฐาน",
  teacherName: "ครูสมชาย ใจดี",
  todayStatus: "present" as const,
  checkedInAt: "08:15 น.",
};

export const demoStats = {
  attendanceRate: 96,
  averageGrade: "3.72",
  totalSessionsThisMonth: 20,
  presentSessionsThisMonth: 19,
};

export const demoHomework: HomeworkItem[] = [
  {
    id: "hw-1",
    subject: "คณิตศาสตร์",
    title: "แบบฝึกหัดบทที่ 5 เรื่องเศษส่วน",
    dueDate: "15 ก.ค. 2569",
    status: "pending",
  },
  {
    id: "hw-2",
    subject: "วิทยาศาสตร์",
    title: "รายงานการทดลอง เรื่องแรงโน้มถ่วง",
    dueDate: "12 ก.ค. 2569",
    status: "submitted",
  },
  {
    id: "hw-3",
    subject: "ภาษาไทย",
    title: "คัดลายมือ บทที่ 3",
    dueDate: "10 ก.ค. 2569",
    status: "late",
  },
  {
    id: "hw-4",
    subject: "ภาษาอังกฤษ",
    title: "Vocabulary Practice Unit 4",
    dueDate: "16 ก.ค. 2569",
    status: "pending",
  },
];

export const demoAiInsight =
  "สัปดาห์นี้น้องพิมเข้าเรียนครบและตรงเวลาทุกวัน แต่วิชาคณิตศาสตร์มีงานค้างส่ง 1 ชิ้น (แบบฝึกหัดบทที่ 5) ควรติดตามให้ส่งภายในวันนี้เพื่อไม่ให้สะสม";

export const demoLineConnection = {
  connected: true,
  accountName: "EduConnect360 Official",
  lastNotifiedAt: "วันนี้ 08:16 น.",
};

export const homeworkStatusMeta: Record<
  HomeworkStatus,
  { label: string; icon: string; className: string }
> = {
  submitted: {
    label: "ส่งแล้ว",
    icon: "fa-circle-check",
    className: "bg-emerald-500/10 text-emerald-600",
  },
  pending: {
    label: "ยังไม่ส่ง",
    icon: "fa-circle-exclamation",
    className: "bg-amber-500/10 text-amber-600",
  },
  late: {
    label: "ส่งช้า",
    icon: "fa-triangle-exclamation",
    className: "bg-red-500/10 text-red-600",
  },
};
