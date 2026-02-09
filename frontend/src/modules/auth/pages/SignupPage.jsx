import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  return (
    <div className="flex min-h-screen">
      {/* Form panel */}
      <div className="grain-texture flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-lg">
          <SignupForm />
        </div>
      </div>

      {/* Dark brand panel */}
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex lg:w-[45%]">
        <div>
          <h1 className="font-display text-4xl tracking-poster text-sidebar-accent-foreground">LRP</h1>
          <p className="mt-1 text-sm text-sidebar-muted-foreground">Loan Referral Platform</p>
        </div>
        <div>
          <blockquote className="border-l-2 border-sidebar-border pl-4">
            <p className="font-serif text-lg italic leading-relaxed text-sidebar-muted-foreground">
              &ldquo;Submit deals in 60 seconds. Track commissions in real time.&rdquo;
            </p>
          </blockquote>
          <p className="mt-4 text-xs text-sidebar-muted-foreground">&copy; {new Date().getFullYear()} Loan Referral Platform</p>
        </div>
      </div>
    </div>
  );
}
