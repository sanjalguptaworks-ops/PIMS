import type { ActivityConfig } from "@/lib/activityConfig";
import { Field, SelectField, TextAreaField } from "@/components/FormFields";
import { createActivityRecordAction } from "@/lib/activityActions";

export default function ActivityForm({ config }: { config: ActivityConfig }) {
  const action = createActivityRecordAction.bind(null, config.slug);

  return (
    <form action={action} className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <Field label="Report Number" name="reportNumber" required />
        <Field label="Report Date" name="reportDate" type="date" />
        <Field label="Mile Post" name="milePost" />
        <Field label="Weather Condition" name="weatherCondition" />
        <Field label="RFI Number" name="rfiNumber" />
        <label className="flex items-center gap-2 text-sm h-[30px]">
          <input type="checkbox" name="downStream" /> Down Stream
        </label>
      </div>

      {config.usesWeldRange && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Weld From (Joint No)" name="weldFrom" />
          <Field label="Weld To (Joint No)" name="weldTo" />
        </div>
      )}

      {config.usesStationRange && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Station From (m)" name="stationFrom" type="number" step="any" />
          <Field label="Station To (m)" name="stationTo" type="number" step="any" />
          <Field label="Section Length (m)" name="sectionLength" type="number" step="any" />
        </div>
      )}

      <div>
        <div className="section-title -mx-4">{config.title} Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          {config.detailFields.map((f) =>
            f.type === "select" ? (
              <SelectField
                key={f.key}
                label={f.label}
                name={`detail_${f.key}`}
                options={(f.options ?? []).map((o) => ({ value: o, label: o }))}
              />
            ) : (
              <Field key={f.key} label={f.label} name={`detail_${f.key}`} type={f.type === "number" ? "number" : "text"} step="any" />
            )
          )}
        </div>
      </div>

      <TextAreaField label="Remarks" name="remarks" />

      <button type="submit" className="btn-primary">
        Save Report
      </button>
    </form>
  );
}
