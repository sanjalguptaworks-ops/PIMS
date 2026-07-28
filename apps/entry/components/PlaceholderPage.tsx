export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="card p-6 text-sm text-slate-600 space-y-2">
        <p>This tool is on the PIMS site map but its exact fields and workflow haven&apos;t been specified yet.</p>
        <p>Once the reference layout or a field list is provided, this screen will be built out like the rest of Master Data.</p>
      </div>
    </div>
  );
}
