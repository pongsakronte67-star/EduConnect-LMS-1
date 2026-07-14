import { Link } from "wouter";
import {
  demoAiInsight,
  demoChild,
  demoHomework,
  demoLineConnection,
  demoStats,
  homeworkStatusMeta,
} from "@/lib/demoParentData";

export default function ParentPortal() {
  return (
    <div className="min-h-[100dvh] w-full bg-background relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[55%] h-[55%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between relative z-10 glass-panel border-x-0 border-t-0 rounded-none">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <i className="fa-solid fa-graduation-cap text-lg" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            EduConnect<span className="text-primary font-extrabold">360</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <i className="fa-solid fa-flask" /> โหมดผู้ปกครอง (Demo)
          </span>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg glass-panel text-sm font-semibold text-foreground hover:bg-white/60 dark:hover:bg-black/20 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket" /> กลับหน้าหลัก
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Child profile card */}
        <section
          className="glass-panel rounded-3xl p-6 sm:p-8 animate-fade-in-up"
          style={{ animationFillMode: "both" }}
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg shadow-primary/20">
              {demoChild.initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
                {demoChild.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {demoChild.nickname} &middot; {demoChild.gradeLevel}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {demoChild.className} &middot; {demoChild.teacherName}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-700">
            <i className="fa-solid fa-circle-check text-lg" />
            <p className="text-sm font-semibold">
              มาเรียนปกติวันนี้ &middot; เช็คชื่อเมื่อ {demoChild.checkedInAt}
            </p>
          </div>
        </section>

        {/* Overview stats */}
        <section
          className="grid grid-cols-2 gap-4 animate-fade-in-up"
          style={{ animationDelay: "80ms", animationFillMode: "both" }}
        >
          <div className="glass-panel rounded-2xl p-5 sm:p-6 text-center">
            <div className="w-11 h-11 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg mb-3">
              <i className="fa-solid fa-calendar-check" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {demoStats.attendanceRate}%
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              อัตราการเข้าเรียน
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-5 sm:p-6 text-center">
            <div className="w-11 h-11 mx-auto rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 text-lg mb-3">
              <i className="fa-solid fa-chart-line" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {demoStats.averageGrade}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              เกรดเฉลี่ย (GPA)
            </p>
          </div>
        </section>

        {/* AI Early Warning */}
        <section
          className="rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-fade-in-up bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-primary/20"
          style={{ animationDelay: "160ms", animationFillMode: "both" }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-white/15 flex items-center justify-center text-lg">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <div>
              <h3 className="font-bold mb-1.5 flex items-center gap-2">
                สรุปโดย AI ประจำสัปดาห์
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 tracking-wide">
                  EARLY WARNING
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-white/90">{demoAiInsight}</p>
            </div>
          </div>
        </section>

        {/* Homework tracker */}
        <section
          className="glass-panel rounded-3xl p-6 sm:p-8 animate-fade-in-up"
          style={{ animationDelay: "240ms", animationFillMode: "both" }}
        >
          <h3 className="text-lg font-bold text-foreground mb-1">ติดตามการบ้าน</h3>
          <p className="text-sm text-muted-foreground mb-5">
            รายการงานล่าสุดที่คุณครูมอบหมาย
          </p>
          <ul className="space-y-3">
            {demoHomework.map((hw) => {
              const meta = homeworkStatusMeta[hw.status];
              return (
                <li
                  key={hw.id}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-background/50 border border-border/60"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {hw.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {hw.subject} &middot; กำหนดส่ง {hw.dueDate}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${meta.className}`}
                  >
                    <i className={`fa-solid ${meta.icon}`} /> {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* LINE OA connection */}
        <section
          className="glass-panel rounded-3xl p-6 sm:p-8 flex items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#06C755] flex items-center justify-center text-white text-xl shadow-lg shadow-[#06C755]/25">
            <i className="fa-brands fa-line" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              เชื่อมต่อการแจ้งเตือนกับ LINE Official Account
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {demoLineConnection.accountName} &middot; แจ้งเตือนล่าสุด{" "}
              {demoLineConnection.lastNotifiedAt}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
          </span>
        </section>
      </main>
    </div>
  );
}
