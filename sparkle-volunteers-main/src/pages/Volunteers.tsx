import { useState } from "react";
import { Search, Filter } from "lucide-react";
import BurnoutBadge from "@/components/BurnoutBadge";
import { useVolunteers, type Volunteer } from "@/hooks/useVolunteers";

const Volunteers = () => {
  const { data: volunteers = [], isLoading } = useVolunteers();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const filtered = volunteers.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || v.burnout_risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading volunteers…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Volunteers</h1>
        <p className="mt-1 text-muted-foreground">Track engagement and workload for each volunteer.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search by name or role..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["all", "low", "medium", "high"] as const).map((r) => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${riskFilter === r ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
              {r === "all" ? "All" : `${r.charAt(0).toUpperCase() + r.slice(1)} Risk`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((v) => (
            <button key={v.id} onClick={() => setSelectedVolunteer(v)}
              className={`w-full animate-fade-in rounded-xl border p-4 text-left transition-all hover:shadow-md ${selectedVolunteer?.id === v.id ? "border-primary bg-accent" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{v.avatar}</div>
                  <div>
                    <p className="font-medium text-foreground">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{v.participation_rate}%</p>
                    <p className="text-xs text-muted-foreground">participation</p>
                  </div>
                  <BurnoutBadge risk={v.burnout_risk} />
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground">No volunteers match your filters.</p>}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          {selectedVolunteer ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">{selectedVolunteer.avatar}</div>
                <h3 className="mt-3 font-serif text-xl font-bold text-foreground">{selectedVolunteer.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedVolunteer.role}</p>
                <div className="mt-2"><BurnoutBadge risk={selectedVolunteer.burnout_risk} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Morale", value: `${selectedVolunteer.morale_score}/10` },
                  { label: "Weekly Hours", value: `${selectedVolunteer.weekly_hours}h` },
                  { label: "Tasks Done", value: `${selectedVolunteer.tasks_completed}/${selectedVolunteer.tasks_assigned}` },
                  { label: "Check-in Streak", value: `${selectedVolunteer.check_in_streak} days` },
                  { label: "Participation", value: `${selectedVolunteer.participation_rate}%` },
                  { label: "Last Active", value: selectedVolunteer.last_active },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Feedback Notes</p>
                <div className="space-y-1.5">
                  {selectedVolunteer.feedback.map((f, i) => (
                    <p key={i} className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">"{f}"</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
              <p>Select a volunteer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
