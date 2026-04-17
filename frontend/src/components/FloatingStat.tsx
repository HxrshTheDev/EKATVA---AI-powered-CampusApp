import { TrendingUp, Target, Zap, Award } from "lucide-react";

interface FloatStatProps {
  label: string;
  value: string;
  position: string;
  delay?: string;
  icon?: string;
}

const iconMap: Record<string, React.ElementType> = {
  chart: TrendingUp,
  target: Target,
  zap: Zap,
  award: Award,
};

const FloatingStat = ({ label, value, position, delay = "0ms", icon }: FloatStatProps) => {
  const Icon = icon ? iconMap[icon] : null;
  
  return (
    <div
      className={`absolute ${position} glass rounded-xl px-4 py-3 animate-float opacity-0 animate-fade-in-up min-w-[120px]`}
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
};

export default FloatingStat;
