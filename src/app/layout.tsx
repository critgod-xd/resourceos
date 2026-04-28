import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const metadata: Metadata = {
  title: "ResourceOS",
  description: "Resource Command Center MVP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let role = 'ADMIN';
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('resourceos_auth')?.value;
    if (token) {
      const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-resourceos-key');
      const verified = await jwtVerify(token, SECRET);
      role = verified.payload.role as string;
    }
  } catch(e) {}

  return (
    <html lang="en">
      <body>
        <Navbar userRole={role} />
        <main style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
