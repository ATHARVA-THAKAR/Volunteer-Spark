import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTaskFeedback } from "@/hooks/useTaskFeedback";
import { useCheckIns } from "@/hooks/useVolunteers";

const Analytics = () => {
  const { data: feedbacks = [], isLoading: fLoad } = useTaskFeedback();
  const { data: checkIns = [], isLoading: cLoad } = useCheckIns();

  if (fLoad || cLoad) return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading analytics…</div>;

  // Morale trend: group check-ins by week, average mood
  const weeklyMorale = (() => {
    const weeks: Record<string, { total: number; count: number }> = {};
    checkIns.forEach((c) => {
      const d = new Date(c.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split("T")[0];
      if (!weeks[key]) weeks[key] = { total: 0, count: 0 };
      weeks[key].total += c.mood;
      weeks[key].count += 1;
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([week, v]) => ({ week, average: Math.round((v.total / v.count) * 10) / 10 }));
  })();

  // Satisfaction trend from feedbacks
  const satisfactionTrend = (() => {
    const months: Record<string, { total: number; count: number }> = {};
    feedbacks.forEach((fb) => {
      const key = new Date(fb.created_at).toISOString().slice(0, 7);
      if (!months[key]) months[key] = { total: 0, count: 0 };
      months[key].total += fb.satisfaction;
      months[key].count += 1;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, v]) => ({ month, avgSatisfaction: Math.round((v.total / v.count) * 10) / 10 }));
  })();

  // Difficulty distribution from feedbacks
  const difficultyDist = [1, 2, 3, 4, 5].map((d) => ({
    level: `${d} Star${d > 1 ? "s" : ""}`,
    count: feedbacks.filter((fb) => fb.difficulty === d).length,
  }));

  // Would do again pie
  const wouldDoAgainData = [
    { name: "Yes", value: feedbacks.filter((fb) => fb.would_do_again).length, fill: "hsl(152, 60%, 42%)" },
    { name: "No", value: feedbacks.filter((fb) => !fb.would_do_again).length, fill: "hsl(4, 72%, 56%)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Data-driven insights derived from volunteer feedback and check-ins.</p>
      </div>

      {feedbacks.length === 0 && checkIns.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">No data yet. Analytics will populate as volunteers submit feedback and check-ins.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-fade-in rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">📊 Morale Trend (Check-ins)</h3>
            {weeklyMorale.length === 0 ? (
              <p className="text-sm text-muted-foreground">No check-in data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={weeklyMorale}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 89%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(200, 10%, 50%)" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(200, 10%, 50%)" />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(40, 15%, 89%)" }} />
                  <Line type="monotone" dataKey="average" stroke="hsl(168, 55%, 38%)" strokeWidth={3} dot={{ r: 5, fill: "hsl(168, 55%, 38%)" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="animate-fade-in rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">📈 Avg Satisfaction (Feedback)</h3>
            {satisfactionTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feedback data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={satisfactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 89%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(200, 10%, 50%)" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="hsl(200, 10%, 50%)" />
                  <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(40, 15%, 89%)" }} />
                  <Bar dataKey="avgSatisfaction" fill="hsl(168, 55%, 38%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="animate-fade-in rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">🔥 Task Difficulty Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={difficultyDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 89%)" />
                <XAxis dataKey="level" tick={{ fontSize: 12 }} stroke="hsl(200, 10%, 50%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(200, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(40, 15%, 89%)" }} />
                <Bar dataKey="count" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="animate-fade-in rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">👍 Would Do Again?</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={wouldDoAgainData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                  {wouldDoAgainData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(40, 15%, 89%)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
