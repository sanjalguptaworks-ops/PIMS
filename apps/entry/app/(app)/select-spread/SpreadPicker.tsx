"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { selectSpreadAction, type SelectSpreadState } from "./actions";

interface Spread {
  id: string;
  name: string;
}
interface LineLoop {
  id: string;
  name: string;
  spreads: Spread[];
}
interface Project {
  id: string;
  name: string;
  lineLoops: LineLoop[];
  clientCompany: { name: string };
}

const initialState: SelectSpreadState = { ok: false };

export default function SpreadPicker({ projects }: { projects: Project[] }) {
  const [state, formAction, pending] = useActionState(selectSpreadAction, initialState);

  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  const [lineLoopId, setLineLoopId] = useState(project?.lineLoops[0]?.id ?? "");
  const lineLoop = useMemo(() => project?.lineLoops.find((l) => l.id === lineLoopId), [project, lineLoopId]);

  const [spreadId, setSpreadId] = useState(lineLoop?.spreads[0]?.id ?? "");

  useEffect(() => {
    if (state.ok) {
      window.location.href = "/";
    }
  }, [state.ok]);

  function onProjectChange(id: string) {
    setProjectId(id);
    const p = projects.find((pr) => pr.id === id);
    const firstLoop = p?.lineLoops[0];
    setLineLoopId(firstLoop?.id ?? "");
    setSpreadId(firstLoop?.spreads[0]?.id ?? "");
  }

  function onLineLoopChange(id: string) {
    setLineLoopId(id);
    const l = project?.lineLoops.find((ll) => ll.id === id);
    setSpreadId(l?.spreads[0]?.id ?? "");
  }

  if (projects.length === 0) {
    return <p className="text-sm text-slate-500">No projects have been set up yet.</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="field-label">Project</label>
        <select className="field-input" value={projectId} onChange={(e) => onProjectChange(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.clientCompany.name})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Line Loop</label>
        <select className="field-input" value={lineLoopId} onChange={(e) => onLineLoopChange(e.target.value)}>
          {project?.lineLoops.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Spread</label>
        <select className="field-input" name="spreadId" value={spreadId} onChange={(e) => setSpreadId(e.target.value)}>
          {lineLoop?.spreads.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary" disabled={!spreadId || pending}>
        {pending ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
