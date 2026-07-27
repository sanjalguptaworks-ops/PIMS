interface Spread {
  id: string;
  name: string;
  lineLoop: { name: string; project: { name: string } };
}

export default function SpreadFilterBar({
  spreads,
  selectedSpreadId,
  action,
}: {
  spreads: Spread[];
  selectedSpreadId?: string;
  action: string | ((formData: FormData) => void);
}) {
  return (
    <form action={action} className="card p-3 flex items-center gap-3 mb-4">
      <label className="text-sm font-medium text-slate-600">Spread</label>
      <select name="spreadId" defaultValue={selectedSpreadId ?? ""} className="field-input max-w-xs">
        <option value="">All Spreads</option>
        {spreads.map((s) => (
          <option key={s.id} value={s.id}>
            {s.lineLoop.project.name} / {s.lineLoop.name} / {s.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-secondary">
        Apply
      </button>
    </form>
  );
}
