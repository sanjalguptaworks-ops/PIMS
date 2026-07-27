export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="field-input"
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  required,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select name={name} required={required} className="field-input" defaultValue={defaultValue ?? ""}>
        <option value="" disabled>
          -Select-
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RadioField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex gap-4 items-center h-[30px]">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-1 text-sm">
            <input type="radio" name={name} value={o.value} defaultChecked={defaultValue === o.value} />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  placeholder,
  rows = 3,
  className,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <textarea name={name} rows={rows} placeholder={placeholder} className="field-input" />
    </div>
  );
}
