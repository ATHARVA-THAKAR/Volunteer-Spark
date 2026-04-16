import { useState } from "react";
import MoodEmoji from "@/components/MoodEmoji";
import { useCheckIns, type CheckIn } from "@/hooks/useVolunteers";
import { useVolunteerProfiles } from "@/hooks/useVolunteerProfiles";
import { Flag, Send, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import TaskFeedbackForm from "@/components/TaskFeedbackForm";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const CheckInsPage = () => {
  const { user } = useAuth();
  const { isAdmin, isVolunteer } = useUserRole();
  const { data: volunteerProfiles = [] } = useVolunteerProfiles();
  const { data: checkIns = [], isLoading } = useCheckIns();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [workload, setWorkload] = useState<CheckIn["workload"]>("moderate");
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const [submitting, setSubmitting] = useState(false);

  // Volunteers see only their own check-ins; admins see all
  const displayed = (() => {
    let list = isVolunteer ? checkIns.filter((c) => c.volunteer_id === user?.id) : checkIns;
    if (filter === "flagged") list = list.filter((c) => c.flagged);
    return list;
  })();

  const myProfile = volunteerProfiles.find((p) => p.id === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !myProfile) return;
    setSubmitting(true);
    const { error } = await supabase.from("check_ins").insert({
      volunteer_id: user.id,
      volunteer_name: myProfile.display_name || user.email || "Unknown",
      date: new Date().toISOString().split("T")[0],
      mood,
      workload,
      comment,
      flagged: mood <= 2 || workload === "overwhelming",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["check_ins"] });
    setShowForm(false);
    setComment("");
    setMood(3);
    setWorkload("moderate");
    toast({ title: "Check-in submitted!" });
  };

  const workloadColor = (w: string) => {
    switch (w) {
      case "light": return "bg-success/15 text-success";
      case "moderate": return "bg-primary/15 text-primary";
      case "heavy": return "bg-warning/15 text-warning";
      case "overwhelming": return "bg-burnout/15 text-burnout";
      default: return "";
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading check-ins…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Check-ins</h1>
          <p className="mt-1 text-muted-foreground">Periodic micro-surveys to gauge volunteer well-being.</p>
        </div>
        <div className="flex gap-2">
          {isVolunteer && (
            <>
              <button onClick={() => { setShowQuestionnaire(!showQuestionnaire); setShowForm(false); }}
                className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                <ClipboardList className="h-4 w-4" /> Task Feedback
              </button>
              <button onClick={() => { setShowForm(!showForm); setShowQuestionnaire(false); }} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                + New Check-in
              </button>
            </>
          )}
        </div>
      </div>

      {showQuestionnaire && isVolunteer && <TaskFeedbackForm onClose={() => setShowQuestionnaire(false)} />}

      {showForm && isVolunteer && (
        <form onSubmit={handleSubmit} className="animate-fade-in rounded-xl border border-primary/30 bg-accent/50 p-6 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">New Micro Check-in</h3>
          <p className="text-sm text-muted-foreground">Submitting as: <span className="font-medium text-foreground">{myProfile?.display_name || user?.email}</span></p>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">How are you feeling?</label>
            <div className="flex gap-3">
              {([1, 2, 3, 4, 5] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMood(m)}
                  className={`rounded-xl border-2 p-3 transition-all ${mood === m ? "border-primary scale-110 bg-accent" : "border-transparent hover:border-border"}`}>
                  <MoodEmoji mood={m} size="lg" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Workload</label>
            <div className="flex flex-wrap gap-2">
              {(["light", "moderate", "heavy", "overwhelming"] as const).map((w) => (
                <button key={w} type="button" onClick={() => setWorkload(w)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${workload === w ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Any comments?</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share how you're doing..." rows={3}
              className="w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit Check-in"}
          </button>
        </form>
      )}

      <div className="flex gap-2">
        {(["all", "flagged"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
            {f === "flagged" && <Flag className="h-3 w-3" />}
            {f === "all" ? "All Check-ins" : "Flagged Only"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.length === 0 && <p className="text-muted-foreground">No check-ins to display.</p>}
        {displayed.map((c) => (
          <div key={c.id} className={`animate-fade-in rounded-xl border p-4 ${c.flagged ? "border-warning/30 bg-warning/5" : "border-border bg-card"}`}>
            <div className="flex items-start gap-3">
              <MoodEmoji mood={c.mood} size="md" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{c.volunteer_name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${workloadColor(c.workload)}`}>{c.workload}</span>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </div>
                </div>
                {c.comment && <p className="mt-1.5 text-sm text-muted-foreground">"{c.comment}"</p>}
                {c.flagged && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-warning">
                    <Flag className="h-3 w-3" /> Auto-flagged for review
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInsPage;
