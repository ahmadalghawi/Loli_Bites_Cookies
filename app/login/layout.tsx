import { AuthGuard } from "@/components/auth-guard";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}