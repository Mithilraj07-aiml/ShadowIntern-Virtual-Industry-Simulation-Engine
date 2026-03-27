import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ShadowIntern — Corp Simulator',
  description: 'A gamified intern simulation platform. Complete tickets, earn XP, survive chaos events, and rise through the ranks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-64 min-h-screen relative z-10">
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
