import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "burnout";
}

const variantStyles = {
  default: "bg-card border-border",
  warning: "bg-warning/10 border-warning/30",
  success: "bg-success/10 border-success/30",
  burnout: "bg-burnout/10 border-burnout/30",
};

const iconStyles = {
  default: "bg-accent text-accent-foreground",
  warning: "bg-warning/20 text-warning",
  success: "bg-success/20 text-success",
  burnout: "bg-burnout/20 text-burnout",
};

const StatCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) => {
  return (
    <div className={`animate-fade-in rounded-xl border p-5 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 font-serif text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
