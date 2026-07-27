import Header from "@/components/Header";

// Every route here reads the session cookie and/or query-driven report data,
// so it should never be served from Next's static/full route cache.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}
