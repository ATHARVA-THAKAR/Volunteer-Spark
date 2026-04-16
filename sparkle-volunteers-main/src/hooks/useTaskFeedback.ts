import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TaskFeedback {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  task_name: string;
  satisfaction: number;
  difficulty: number;
  support_needed: string;
  improvements: string;
  would_do_again: boolean;
  created_at: string;
}

export function useTaskFeedback() {
  return useQuery({
    queryKey: ["task_feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TaskFeedback[];
    },
  });
}
