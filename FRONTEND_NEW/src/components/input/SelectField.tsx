import React from "react";

interface SelectFieldProps {
  id: string;
  name?: string;
  label: string;
  options: { _id: string; name: string }[];
  value?: string;
  onChange?: ({ name, value }: { name: string; value: string }) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  name = "",
  options,
  value,
  onChange,
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
        <select
          id={id}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-big-stone-900 focus:border-big-stone-900 block w-full p-2.5"
          onChange={(e) =>
            onChange && onChange({ name, value: e.target.value })
          }
          name={name}
          value={value}
        >
          {options.length > 0 &&
            options.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
