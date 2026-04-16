import { useState } from "react";
import { Users, AlertTriangle, TrendingUp, ClipboardCheck, Star, ThumbsUp, ThumbsDown, Send, ListTodo } from "lucide-react";
import StatCard from "@/components/StatCard";
import BurnoutBadge from "@/components/BurnoutBadge";
import MoodEmoji from "@/components/MoodEmoji";
import { useCheckIns } from "@/hooks/useVolunteers";
import { useTaskFeedback } from "@/hooks/useTaskFeedback";
import { useVolunteerProfiles } from "@/hooks/useVolunteerProfiles";
import { useTasks, useAssignTask } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: checkIns = [], isLoading: cLoading } = useCheckIns();
  const { data: feedbacks = [], isLoading: fLoading } = useTaskFeedback();
  const { data: volunteerProfiles = [] } = useVolunteerProfiles();
  const { data: tasks = [] } = useTasks();
  const assignTask = useAssignTask();

  const [showAssign, setShowAssign] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignTo, setAssignTo] = useState("");

  const activeVolunteerCount = volunteerProfiles.filter((p) => p.is_active).length;
  const totalVolunteerCount = volunteerProfiles.length;

  // Participation: % of volunteers who submitted at least one feedback
  const volunteersWithFeedback = new Set(feedbacks.map((fb) => fb.volunteer_id));
  const participation = totalVolunteerCount > 0
    ? Math.round((volunteersWithFeedback.size / totalVolunteerCount) * 100)
    : 0;

  // Average morale: derived from avg satisfaction across all feedbacks + avg check-in mood
  const avgMorale = (() => {
    const avgSat = feedbacks.length > 0
      ? feedbacks.reduce((s, fb) => s + fb.satisfaction, 0) / feedbacks.length
      : 0;
    const avgMood = checkIns.length > 0
      ? checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length
      : 0;
    if (avgSat > 0 && avgMood > 0) return ((avgSat + avgMood) / 2).toFixed(1);
    if (avgSat > 0) return avgSat.toFixed(1);
    if (avgMood > 0) return avgMood.toFixed(1);
    return "0";
  })();

  // Burnout: volunteers with 5+ task feedbacks in last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyTaskCounts: Record<string, { name: string; count: number }> = {};
  feedbacks.forEach((fb) => {
    if (new Date(fb.created_at) >= oneWeekAgo) {
      if (!weeklyTaskCounts[fb.volunteer_id]) weeklyTaskCounts[fb.volunteer_id] = { name: fb.volunteer_name, count: 0 };
      weeklyTaskCounts[fb.volunteer_id].count += 1;
    }
  });
  const burnoutVolunteers = Object.entries(weeklyTaskCounts)
    .filter(([, v]) => v.count >= 5)
    .map(([id, v]) => ({ id, name: v.name, count: v.count }));

  const flaggedCheckIns = checkIns.filter((c) => c.flagged);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const vol = volunteerProfiles.find((v) => v.id === assignTo);
    if (!vol || !user?.id) return;
    assignTask.mutate(
      { title: taskTitle, description: taskDesc, assigned_to: assignTo, assigned_to_name: vol.display_name || "Unknown", created_by: user.id },
      {
        onSuccess: () => {
          toast({ title: "Task assigned!" });
          setShowAssign(false);
          setTaskTitle("");
          setTaskDesc("");
          setAssignTo("");
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      }
    );
  };

  if (cLoading || fLoading) {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading dashboard…</div>;
  }

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= count ? "fill-warning text-warning" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Monitor volunteer well-being and engagement at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} title="Active Volunteers" value={activeVolunteerCount} subtitle={`${totalVolunteerCount} total registered`} />
        <StatCard icon={AlertTriangle} title="Burnout Alerts" value={burnoutVolunteers.length} subtitle="Immediate action needed" variant="burnout" />
        <StatCard icon={TrendingUp} title="Avg Morale" value={avgMorale} subtitle="out of 5" variant={Number(avgMorale) < 3 ? "warning" : "success"} />
        <StatCard icon={ClipboardCheck} title="Participation" value={`${participation}%`} subtitle="volunteers with feedback" variant="success" />
      </div>

      {/* Assign Task */}
      <div className="flex gap-3">
        <button onClick={() => setShowAssign(!showAssign)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <ListTodo className="h-4 w-4" /> {showAssign ? "Close" : "Assign Task"}
        </button>
      </div>

      {showAssign && (
        <form onSubmit={handleAssign} className="animate-fade-in rounded-xl border border-primary/30 bg-accent/50 p-6 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">📋 Assign Task to Volunteer</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Volunteer</label>
              <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} required
                className="w-full rounded-lg border border-input bg-card p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select volunteer...</option>
                {volunteerProfiles.map((v) => (
                  <option key={v.id} value={v.id}>{v.display_name || "Unnamed"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Task Title</label>
              <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="e.g. Community cleanup"
                className="w-full rounded-lg border border-input bg-card p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Description (optional)</label>
            <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} rows={2} placeholder="Task details..."
              className="w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" disabled={assignTask.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            <Send className="h-4 w-4" /> {assignTask.isPending ? "Assigning…" : "Assign Task"}
          </button>
        </form>
      )}

      {/* Assigned Tasks */}
      {tasks.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">📌 Assigned Tasks</h2>
          <div className="space-y-3">
            {tasks.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground">Assigned to: {t.assigned_to_name}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.status === "completed" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-foreground">🚨 Burnout Alerts</h2>
            <button onClick={() => navigate("/volunteers")} className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          {burnoutVolunteers.length === 0 ? (
            <p className="text-muted-foreground">No burnout alerts. Great!</p>
          ) : (
            <div className="space-y-3">
              {burnoutVolunteers.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-burnout/20 bg-burnout/5 p-4">
                  <div>
                    <p className="font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.count} tasks this week</p>
                  </div>
                  <BurnoutBadge risk={v.count >= 6 ? "high" : "medium"} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-foreground">⚠️ Flagged Check-ins</h2>
            <button onClick={() => navigate("/check-ins")} className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          {flaggedCheckIns.length === 0 ? (
            <p className="text-muted-foreground">No flagged check-ins.</p>
          ) : (
            <div className="space-y-3">
              {flaggedCheckIns.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4">
                  <MoodEmoji mood={c.mood} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{c.volunteer_name}</p>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">"{c.comment}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Feedback */}
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">📝 Recent Task Feedback</h2>
          <span className="text-sm text-muted-foreground">{feedbacks.length} responses</span>
        </div>
        {feedbacks.length === 0 ? (
          <p className="text-muted-foreground">No task feedback yet.</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.slice(0, 6).map((fb) => (
              <div key={fb.id} className="rounded-lg border border-border bg-muted/50 p-4 transition-all hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{fb.volunteer_name}</p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{fb.task_name}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Satisfaction:</span>
                        {renderStars(fb.satisfaction)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Difficulty:</span>
                        {renderStars(fb.difficulty)}
                      </div>
                      <div className="flex items-center gap-1">
                        {fb.would_do_again ? (
                          <ThumbsUp className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <ThumbsDown className="h-3.5 w-3.5 text-burnout" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {fb.would_do_again ? "Would repeat" : "Wouldn't repeat"}
                        </span>
                      </div>
                    </div>
                    {(fb.support_needed || fb.improvements) && (
                      <div className="mt-2 space-y-1">
                        {fb.support_needed && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Support needed:</span> "{fb.support_needed}"
                          </p>
                        )}
                        {fb.improvements && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Suggestions:</span> "{fb.improvements}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
