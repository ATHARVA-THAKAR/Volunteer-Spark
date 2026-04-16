export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
  tasksCompleted: number;
  tasksAssigned: number;
  participationRate: number; // 0-100
  lastActive: string;
  moraleScore: number; // 1-10
  burnoutRisk: "low" | "medium" | "high";
  weeklyHours: number;
  checkInStreak: number;
  feedback: string[];
}

export interface CheckIn {
  id: string;
  volunteerId: string;
  volunteerName: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  workload: "light" | "moderate" | "heavy" | "overwhelming";
  comment: string;
  flagged: boolean;
}

export const volunteers: Volunteer[] = [
  {
    id: "v1", name: "Amara Osei", email: "amara@zeal.org", role: "Community Outreach",
    avatar: "AO", joinDate: "2024-03-15", tasksCompleted: 47, tasksAssigned: 52,
    participationRate: 90, lastActive: "2026-02-19", moraleScore: 8, burnoutRisk: "low",
    weeklyHours: 12, checkInStreak: 14, feedback: ["Loves fieldwork", "Great team player"]
  },
  {
    id: "v2", name: "Ravi Menon", email: "ravi@zeal.org", role: "Data Entry",
    avatar: "RM", joinDate: "2024-06-01", tasksCompleted: 89, tasksAssigned: 95,
    participationRate: 94, lastActive: "2026-02-20", moraleScore: 6, burnoutRisk: "medium",
    weeklyHours: 22, checkInStreak: 3, feedback: ["Overloaded with tasks", "Needs support"]
  },
  {
    id: "v3", name: "Sofia Alvarez", email: "sofia@zeal.org", role: "Event Coordination",
    avatar: "SA", joinDate: "2024-01-10", tasksCompleted: 34, tasksAssigned: 60,
    participationRate: 57, lastActive: "2026-02-10", moraleScore: 4, burnoutRisk: "high",
    weeklyHours: 28, checkInStreak: 0, feedback: ["Missed last 3 check-ins", "Considering leaving"]
  },
  {
    id: "v4", name: "James Nkomo", email: "james@zeal.org", role: "Training Lead",
    avatar: "JN", joinDate: "2024-09-20", tasksCompleted: 22, tasksAssigned: 25,
    participationRate: 88, lastActive: "2026-02-18", moraleScore: 9, burnoutRisk: "low",
    weeklyHours: 8, checkInStreak: 21, feedback: ["Enthusiastic", "Wants more responsibility"]
  },
  {
    id: "v5", name: "Priya Sharma", email: "priya@zeal.org", role: "Social Media",
    avatar: "PS", joinDate: "2025-01-05", tasksCompleted: 15, tasksAssigned: 18,
    participationRate: 83, lastActive: "2026-02-19", moraleScore: 7, burnoutRisk: "low",
    weeklyHours: 10, checkInStreak: 7, feedback: ["Creative", "Good with content"]
  },
  {
    id: "v6", name: "Liam Chen", email: "liam@zeal.org", role: "Logistics",
    avatar: "LC", joinDate: "2024-11-12", tasksCompleted: 41, tasksAssigned: 50,
    participationRate: 82, lastActive: "2026-02-15", moraleScore: 5, burnoutRisk: "medium",
    weeklyHours: 18, checkInStreak: 1, feedback: ["Feeling underappreciated", "Transport issues"]
  },
  {
    id: "v7", name: "Fatima Hassan", email: "fatima@zeal.org", role: "Fundraising",
    avatar: "FH", joinDate: "2024-04-22", tasksCompleted: 63, tasksAssigned: 70,
    participationRate: 90, lastActive: "2026-02-20", moraleScore: 8, burnoutRisk: "low",
    weeklyHours: 14, checkInStreak: 18, feedback: ["Strong performer", "Good morale"]
  },
  {
    id: "v8", name: "Diego Reyes", email: "diego@zeal.org", role: "Field Operations",
    avatar: "DR", joinDate: "2025-02-01", tasksCompleted: 5, tasksAssigned: 12,
    participationRate: 42, lastActive: "2026-02-08", moraleScore: 3, burnoutRisk: "high",
    weeklyHours: 30, checkInStreak: 0, feedback: ["New but overwhelmed", "Needs mentoring"]
  },
];

export const checkIns: CheckIn[] = [
  { id: "c1", volunteerId: "v1", volunteerName: "Amara Osei", date: "2026-02-19", mood: 4, workload: "moderate", comment: "Good week, enjoyed the community event!", flagged: false },
  { id: "c2", volunteerId: "v2", volunteerName: "Ravi Menon", date: "2026-02-19", mood: 3, workload: "heavy", comment: "Too many data entries. Need help.", flagged: true },
  { id: "c3", volunteerId: "v3", volunteerName: "Sofia Alvarez", date: "2026-02-05", mood: 2, workload: "overwhelming", comment: "I'm exhausted. Can't keep up with events.", flagged: true },
  { id: "c4", volunteerId: "v4", volunteerName: "James Nkomo", date: "2026-02-20", mood: 5, workload: "light", comment: "Training session went amazingly well!", flagged: false },
  { id: "c5", volunteerId: "v5", volunteerName: "Priya Sharma", date: "2026-02-18", mood: 4, workload: "moderate", comment: "Posted 3 reels this week. Feeling productive.", flagged: false },
  { id: "c6", volunteerId: "v6", volunteerName: "Liam Chen", date: "2026-02-14", mood: 2, workload: "heavy", comment: "Transport costs are piling up. No reimbursement yet.", flagged: true },
  { id: "c7", volunteerId: "v7", volunteerName: "Fatima Hassan", date: "2026-02-20", mood: 4, workload: "moderate", comment: "Donor meeting was successful!", flagged: false },
  { id: "c8", volunteerId: "v8", volunteerName: "Diego Reyes", date: "2026-02-03", mood: 1, workload: "overwhelming", comment: "I don't know what I'm doing. No guidance.", flagged: true },
  { id: "c9", volunteerId: "v1", volunteerName: "Amara Osei", date: "2026-02-12", mood: 5, workload: "light", comment: "Wrapped up the newsletter distribution early.", flagged: false },
  { id: "c10", volunteerId: "v2", volunteerName: "Ravi Menon", date: "2026-02-12", mood: 3, workload: "heavy", comment: "Stayed late again to finish records.", flagged: true },
];

export const weeklyMoraleData = [
  { week: "Jan W1", average: 6.8 },
  { week: "Jan W2", average: 6.5 },
  { week: "Jan W3", average: 6.2 },
  { week: "Jan W4", average: 6.0 },
  { week: "Feb W1", average: 5.8 },
  { week: "Feb W2", average: 5.5 },
  { week: "Feb W3", average: 5.9 },
  { week: "Feb W4", average: 6.1 },
];

export const participationData = [
  { month: "Sep", rate: 88 },
  { month: "Oct", rate: 85 },
  { month: "Nov", rate: 82 },
  { month: "Dec", rate: 75 },
  { month: "Jan", rate: 78 },
  { month: "Feb", rate: 80 },
];

export const burnoutDistribution = [
  { risk: "Low", count: 4, fill: "hsl(152, 60%, 42%)" },
  { risk: "Medium", count: 2, fill: "hsl(38, 92%, 50%)" },
  { risk: "High", count: 2, fill: "hsl(4, 72%, 56%)" },
];
