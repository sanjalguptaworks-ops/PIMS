import Header from "@/components/Header";

// Every route under this group reads the session/spread cookies via requireAuth()/
// requireSpread(). Force dynamic rendering so Next never caches a Server Action's
// response (which otherwise gets captured once — with no session — at build time
// and served to every subsequent request regardless of the real cookie state).
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}
