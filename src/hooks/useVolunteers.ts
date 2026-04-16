import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  join_date: string;
  tasks_completed: number;
  tasks_assigned: number;
  participation_rate: number;
  last_active: string;
  morale_score: number;
  burnout_risk: "low" | "medium" | "high";
  weekly_hours: number;
  check_in_streak: number;
  feedback: string[];
}

export interface CheckIn {
  id: string;
  volunteer_id: string;
  volunteer_name: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  workload: "light" | "moderate" | "heavy" | "overwhelming";
  comment: string;
  flagged: boolean;
}

export function useVolunteers() {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Volunteer[];
    },
  });
}

export function useCheckIns() {
  return useQuery({
    queryKey: ["check_ins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as CheckIn[];
    },
  });
}

export function useWeeklyMorale() {
  return useQuery({
    queryKey: ["weekly_morale"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weekly_morale").select("*");
      if (error) throw error;
      return data as { week: string; average: number }[];
    },
  });
}

export function useParticipationData() {
  return useQuery({
    queryKey: ["participation_data"],
    queryFn: async () => {
      const { data, error } = await supabase.from("participation_data").select("*");
      if (error) throw error;
      return data as { month: string; rate: number }[];
    },
  });
}
