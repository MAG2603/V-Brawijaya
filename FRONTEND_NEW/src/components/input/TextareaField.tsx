import React from "react";

interface TextareaFieldProps {
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: ({ name, value }: { name: string; value: string }) => void;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  label,
  name = "",
  placeholder = "",
  rows = 4,
  onChange,
  value,
}) => {
  return (
    <div className="p-4 md:p-5 space-y-4 -mt-5">
      <div className="col-span-2">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        <textarea
          name={name}
          id={id}
          rows={rows}
          value={value}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-big-stone-900 focus:border-big-stone-900"
          placeholder={placeholder}
          onChange={(e) =>
            onChange && onChange({ name, value: e.target.value })
          }
        ></textarea>
      </div>
    </div>
  );
};

export default TextareaField;
