import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VolunteerProfile {
  id: string;
  display_name: string | null;
  is_active: boolean;
}

export function useVolunteerProfiles() {
  return useQuery({
    queryKey: ["volunteer_profiles"],
    queryFn: async () => {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "volunteer");
      if (rolesError) throw rolesError;

      const volunteerIds = roles.map((r) => r.user_id);
      if (volunteerIds.length === 0) return [] as VolunteerProfile[];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, is_active")
        .in("id", volunteerIds);
      if (profilesError) throw profilesError;

      return profiles as VolunteerProfile[];
    },
  });
}

export function useToggleActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: isActive } as any)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer_profiles"] });
    },
  });
}
