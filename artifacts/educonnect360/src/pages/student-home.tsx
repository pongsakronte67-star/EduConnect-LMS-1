import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getClassesForStudent, joinClassByCode } from "@/lib/firestore";
import { coverGradient } from "@/lib/covers";
import type { Class } from "@/types";

export default function StudentHome() {
  const { profile, logout } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function refresh() {
    if (!profile) return;
    setLoading(true);
    try {
      const list = await getClassesForStudent(profile.id);
      setClasses(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (err) {
      toast({
        variant: "destructive",
        title: "โหลดข้อมูลห้องเรียนไม่สำเร็จ",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setJoining(true);
    try {
      await joinClassByCode(code, profile.id);
      toast({ title: "เข้าร่วมห้องเรียนสำเร็จ" });
      setCode("");
      setShowJoin(false);
      refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "เข้าร่วมห้องเรียนไม่สำเร็จ",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[55%] h-[55%] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between relative z-10 glass-panel border-x-0 border-t-0 rounded-none">
        <Link href="/student" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <i className="fa-solid fa-graduation-cap text-lg" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            EduConnect<span className="text-primary font-extrabold">360</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <i className="fa-solid fa-user-graduate text-primary" /> {profile?.displayName}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg glass-panel text-sm font-semibold text-foreground hover:bg-white/60 dark:hover:bg-black/20 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket" /> ออกจากระบบ
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">ห้องเรียนของฉัน</h1>
            <p className="text-muted-foreground mt-1">เข้าร่วมห้องเรียนและเช็คชื่อเข้าเรียน</p>
          </div>
          <button
            onClick={() => setShowJoin(true)}
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <i className="fa-solid fa-key" /> เข้าร่วมด้วยรหัส
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
            <i className="fa-solid fa-circle-notch fa-spin text-primary" /> กำลังโหลด...
          </div>
        ) : classes.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center animate-fade-in-up">
            <i className="fa-solid fa-door-open text-4xl text-primary/50 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">ยังไม่ได้เข้าร่วมห้องเรียน</h3>
            <p className="text-muted-foreground mb-6">
              ขอรหัสห้องเรียน 6 หลักจากครูผู้สอนเพื่อเข้าร่วม
            </p>
            <button
              onClick={() => setShowJoin(true)}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
            >
              เข้าร่วมห้องเรียน
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, idx) => (
              <Link
                key={cls.id}
                href={`/student/classes/${cls.id}`}
                className="glass-panel rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "both" } as React.CSSProperties}
              >
                <div className={`h-24 w-full bg-gradient-to-br ${coverGradient(cls.cover)} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-book text-3xl text-white/90" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-1">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cls.gradeLevel}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <i className="fa-solid fa-chalkboard-user text-primary/70" /> {cls.teacherName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in-up">
          <div className="glass-panel rounded-3xl p-8 w-full max-w-md bg-card/95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">เข้าร่วมห้องเรียน</h2>
              <button
                onClick={() => setShowJoin(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleJoin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  รหัสเข้าห้อง 6 หลัก
                </label>
                <input
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-center text-2xl tracking-[0.5em] font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={joining || code.length !== 6}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {joining ? <i className="fa-solid fa-circle-notch fa-spin" /> : "เข้าร่วมห้องเรียน"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
