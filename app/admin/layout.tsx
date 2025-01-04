import { ProtectedRoute } from "@/components/protected-route";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <AdminNav />
        {children}
      </div>
    </ProtectedRoute>
  );
}