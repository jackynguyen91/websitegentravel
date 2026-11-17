import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/_authed/admin")({
  ssr: false,
  component: AdminLayout,
});