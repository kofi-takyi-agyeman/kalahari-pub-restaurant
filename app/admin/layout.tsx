import React from "react";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin/adminAuth";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { businessConfig } from "@/lib/businessConfig";

export const metadata: Metadata = {
  title: `Admin Portal | ${businessConfig.name}`,
  description: `Management and order processing dashboard for ${businessConfig.name}.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-[#11110E] text-white flex flex-col font-sans antialiased">
      {session.isAuthenticated && (
        <AdminNavbar userEmail={session.user?.email || "Staff"} />
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
