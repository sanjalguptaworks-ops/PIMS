import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// Every route here reads the session cookie and/or query-driven report data,
// so it should never be served from Next's static/full route cache.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 min-w-0">{children}</main>
      </div>
    </>
  );
}
