import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: ({ name, value }: { name: string; value: string }) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  name = "",
  type = "text",
  placeholder = "",
  required = false,
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
        <input
          value={value}
          name={name}
          type={type}
          id={id}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder={placeholder}
          required={required}
          onChange={(e) =>
            onChange && onChange({ name, value: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default InputField;
