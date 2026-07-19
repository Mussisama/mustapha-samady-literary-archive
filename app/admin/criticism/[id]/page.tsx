import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { criticism } from "@/lib/data";
import { CriticismEditor } from "./CriticismEditor";

export default async function AdminCriticismEditorPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const item = criticism.find((entry) => entry.id === id);
  if (!item) notFound();
  return <div className="admin-page"><div className="admin-heading-row"><div><Link href="/admin/criticism">نقد و نظر ←</Link><h1>{item.title}</h1></div></div><CriticismEditor item={item} /></div>;
}
