import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useVolunteerProfiles } from "@/hooks/useVolunteerProfiles";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Send, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFeedbackFormProps {
  onClose: () => void;
}

const TaskFeedbackForm = ({ onClose }: TaskFeedbackFormProps) => {
  const { data: volunteerProfiles = [] } = useVolunteerProfiles();
  const { user } = useAuth();
  const { isVolunteer } = useUserRole();
  const queryClient = useQueryClient();

  // Auto-select current user if they're a volunteer
  const [volunteerId, setVolunteerId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [supportNeeded, setSupportNeeded] = useState("");
  const [improvements, setImprovements] = useState("");
  const [wouldDoAgain, setWouldDoAgain] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isVolunteer && user?.id) {
      setVolunteerId(user.id);
    }
  }, [isVolunteer, user?.id]);

  const vol = volunteerProfiles.find((v) => v.id === volunteerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vol) return;
    setSubmitting(true);

    const { error } = await supabase.from("task_feedback").insert({
      volunteer_id: vol.id,
      volunteer_name: vol.display_name || "Unknown",
      task_name: taskName,
      satisfaction,
      difficulty,
      support_needed: supportNeeded,
      improvements,
      would_do_again: wouldDoAgain,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["task_feedback"] });
    toast({ title: "Feedback submitted!", description: "Thank you for your response." });
    onClose();
  };

  const StarRating = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-md p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= value ? "fill-warning text-warning" : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in rounded-xl border border-primary/30 bg-accent/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">📝 Task Completion Questionnaire</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Volunteer</label>
            <select
              value={volunteerId}
              onChange={(e) => setVolunteerId(e.target.value)}
              required
              disabled={isVolunteer}
              className="w-full rounded-lg border border-input bg-card p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            >
              <option value="">Select volunteer...</option>
              {volunteerProfiles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.display_name || "Unnamed"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Task Name</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="e.g. Community cleanup drive"
              className="w-full rounded-lg border border-input bg-card p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StarRating value={satisfaction} onChange={setSatisfaction} label="How satisfied were you?" />
          <StarRating value={difficulty} onChange={setDifficulty} label="How difficult was this task?" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Did you need additional support?</label>
          <textarea
            value={supportNeeded}
            onChange={(e) => setSupportNeeded(e.target.value)}
            placeholder="Describe any support you needed..."
            rows={2}
            className="w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Suggestions for improvement?</label>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            placeholder="Any ideas to improve the process..."
            rows={2}
            className="w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Would you do this task again?</label>
          <div className="flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setWouldDoAgain(val)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  wouldDoAgain === val
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {val ? "👍 Yes" : "👎 No"}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="gap-2">
          <Send className="h-4 w-4" />
          {submitting ? "Submitting…" : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
};

export default TaskFeedbackForm;
