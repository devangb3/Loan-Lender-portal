import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-glow-pulse rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] animate-glow-pulse rounded-full bg-secondary/[0.05] blur-[100px] [animation-delay:2s]" />
      </div>

      {/* Subtle dot grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">LRP</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loan Referral Platform</p>
        </div>

        <SignupForm />

        <p className="mt-8 text-center text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Loan Referral Platform</p>
      </div>
    </div>
  );
}
