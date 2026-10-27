import "./admin.css";
import { AdminProviders } from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrapeLab Admin",
  description: "Admin panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  );
}
