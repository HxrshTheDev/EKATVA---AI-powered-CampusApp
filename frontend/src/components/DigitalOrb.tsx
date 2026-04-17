const DigitalOrb = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-orb-pulse blur-xl" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-secondary/15 to-accent/15 animate-orb-pulse blur-lg" style={{ animationDelay: '1s' }} />
      
      {/* Rotating ring */}
      <div className="absolute inset-6 rounded-full border border-primary/30 animate-orb-rotate" />
      <div className="absolute inset-10 rounded-full border border-secondary/20 animate-orb-rotate" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
      
      {/* Core orb */}
      <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary via-secondary to-primary animate-orb-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-foreground/10" />
      </div>
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-accent animate-glow-pulse shadow-lg shadow-accent/50" />
      </div>
      
      {/* Orbiting dots */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          className="absolute inset-0 animate-orb-rotate"
          style={{ animationDuration: `${12 + deg / 30}s`, transform: `rotate(${deg}deg)` }}
        >
          <div className="absolute top-2 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/60" />
        </div>
      ))}
    </div>
  );
};

export default DigitalOrb;
