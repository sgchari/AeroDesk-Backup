
// Redundant layout removed to resolve route conflict. 
// Dashboard components now use /src/app/dashboard/layout.tsx exclusively.
export default function RedundantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
