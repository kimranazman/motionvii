export function GlowBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <div
        className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
