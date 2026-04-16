interface BurnoutBadgeProps {
  risk: "low" | "medium" | "high";
}

const styles = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-burnout/15 text-burnout animate-pulse-soft",
};

const labels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

const BurnoutBadge = ({ risk }: BurnoutBadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[risk]}`}>
    {labels[risk]}
  </span>
);

export default BurnoutBadge;
