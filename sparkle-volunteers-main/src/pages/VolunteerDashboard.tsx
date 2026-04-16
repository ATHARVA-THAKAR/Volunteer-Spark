import { useState } from "react";
import { ClipboardCheck, Star, Heart, AlertTriangle, Power, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import MoodEmoji from "@/components/MoodEmoji";
import TaskFeedbackForm from "@/components/TaskFeedbackForm";
import BurnoutBadge from "@/components/BurnoutBadge";
import { useCheckIns } from "@/hooks/useVolunteers";
import { useTaskFeedback } from "@/hooks/useTaskFeedback";
import { useAuth } from "@/hooks/useAuth";
import { useVolunteerProfiles, useToggleActive } from "@/hooks/useVolunteerProfiles";
import { useTasks, useUpdateTaskStatus } from "@/hooks/useTasks";
import { toast } from "@/hooks/use-toast";

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { data: checkIns = [], isLoading: cLoading } = useCheckIns();
  const { data: feedbacks = [], isLoading: fLoading } = useTaskFeedback();
  const { data: volunteerProfiles = [] } = useVolunteerProfiles();
  const { data: tasks = [] } = useTasks();
  const toggleActive = useToggleActive();
  const updateTaskStatus = useUpdateTaskStatus();
  const [showFeedback, setShowFeedback] = useState(false);

  const myProfile = volunteerProfiles.find((p) => p.id === user?.id);
  const isActive = myProfile?.is_active ?? false;

  const myCheckIns = checkIns.filter((c) => c.volunteer_id === user?.id).slice(0, 5);
  const myFeedbacks = feedbacks.filter((fb) => fb.volunteer_id === user?.id).slice(0, 5);
  const myTasks = tasks.filter((t) => t.assigned_to === user?.id);
  const pendingTasks = myTasks.filter((t) => t.status === "pending");
  const totalFeedbacks = feedbacks.filter((fb) => fb.volunteer_id === user?.id).length;

  // Current mood from check-ins & feedback
  const latestMood = (() => {
    if (myCheckIns.length === 0 && myFeedbacks.length === 0) return 0;
    const checkInMood = myCheckIns.length > 0 ? myCheckIns[0].mood : 0;
    const avgSatisfaction = myFeedbacks.length > 0
      ? myFeedbacks.reduce((sum, fb) => sum + fb.satisfaction, 0) / myFeedbacks.length
      : 0;
    if (checkInMood > 0 && avgSatisfaction > 0) return Math.round((checkInMood + avgSatisfaction) / 2);
    return checkInMood || Math.round(avgSatisfaction);
  })();

  // Burnout: 5+ feedbacks in last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyTaskCount = feedbacks.filter(
    (fb) => fb.volunteer_id === user?.id && new Date(fb.created_at) >= oneWeekAgo
  ).length;
  const isBurnout = weeklyTaskCount >= 5;
  const burnoutRisk: "low" | "medium" | "high" = weeklyTaskCount >= 6 ? "high" : weeklyTaskCount >= 5 ? "medium" : "low";
  const [showBurnout, setShowBurnout] = useState(false);

  const handleCompleteTask = (taskId: string) => {
    updateTaskStatus.mutate(
      { taskId, status: "completed" },
      {
        onSuccess: () => toast({ title: "Task marked as completed!" }),
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  if (cLoading || fLoading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Welcome back! 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's your volunteering overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Heart} title="Current Mood" value={latestMood} subtitle={latestMood === 0 ? "no data yet" : "from check-ins & feedback"} variant={latestMood === 0 ? "warning" : latestMood <= 2 ? "burnout" : latestMood <= 3 ? "warning" : "success"} />
        <StatCard icon={ClipboardCheck} title="Check-ins" value={myCheckIns.length} subtitle="total submitted" />
        <StatCard icon={Star} title="Feedback Given" value={totalFeedbacks} subtitle="task reviews" variant="success" />
        <StatCard icon={AlertTriangle} title="Pending Tasks" value={pendingTasks.length} subtitle="assigned to you" variant={pendingTasks.length > 0 ? "warning" : "success"} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => setShowFeedback(!showFeedback)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <ClipboardCheck className="h-4 w-4" />
          {showFeedback ? "Close Feedback Form" : "Submit Task Feedback"}
        </button>
        <button onClick={() => setShowBurnout(!showBurnout)}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
            isBurnout ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-pulse" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}>
          <AlertTriangle className="h-4 w-4" /> Burnout Status
        </button>
        <button
          onClick={() => { if (user?.id) toggleActive.mutate({ userId: user.id, isActive: !isActive }); }}
          disabled={toggleActive.isPending}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
            isActive ? "bg-success text-success-foreground hover:bg-success/90" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}>
          <Power className="h-4 w-4" />
          {toggleActive.isPending ? "Updating…" : isActive ? "Active ✓" : "Go Active"}
        </button>
      </div>

      {showBurnout && (
        <div className={`animate-fade-in rounded-xl border p-6 ${isBurnout ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl font-semibold text-foreground">🔥 Burnout Status</h2>
            <BurnoutBadge risk={burnoutRisk} />
          </div>
          {isBurnout ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive font-medium">⚠️ You've completed {weeklyTaskCount} tasks this week. This high workload indicates potential burnout.</p>
              <p className="text-sm text-muted-foreground">Consider reaching out to your coordinator for support or adjusting your workload.</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">You're doing well! {weeklyTaskCount} task(s) this week. No burnout detected.</p>
          )}
        </div>
      )}

      {showFeedback && <TaskFeedbackForm onClose={() => setShowFeedback(false)} />}

      {/* Assigned Tasks */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">📌 Your Tasks</h2>
        {myTasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {myTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">{t.title}</p>
                  {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.status === "completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {t.status}
                  </span>
                  {t.status === "pending" && (
                    <button onClick={() => handleCompleteTask(t.id)} disabled={updateTaskStatus.isPending}
                      className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20 transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent check-ins */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">📋 Recent Check-ins</h2>
        {myCheckIns.length === 0 ? (
          <p className="text-muted-foreground">No check-ins yet. Head to Check-ins to submit one!</p>
        ) : (
          <div className="space-y-3">
            {myCheckIns.map((c) => (
              <div key={c.id} className={`flex items-start gap-3 rounded-lg border p-4 ${c.flagged ? "border-warning/30 bg-warning/5" : "border-border"}`}>
                <MoodEmoji mood={c.mood} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{c.volunteer_name}</span>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </div>
                  {c.comment && <p className="mt-1 text-sm text-muted-foreground">"{c.comment}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent feedback */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">⭐ Your Task Feedback</h2>
        {myFeedbacks.length === 0 ? (
          <p className="text-muted-foreground">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {myFeedbacks.map((fb) => (
              <div key={fb.id} className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{fb.task_name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(fb.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Satisfaction: {fb.satisfaction}/5</span>
                  <span>Difficulty: {fb.difficulty}/5</span>
                  <span>{fb.would_do_again ? "✅ Would repeat" : "❌ Wouldn't repeat"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
