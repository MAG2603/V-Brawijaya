import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const FieldMoreInformation = [
  { name: "subject", label: "Subjek", type: "text", value: "" },
  {
    name: "date",
    label: "Tanggal Dibuat / Ditemukan",
    type: "date",
    value: "",
  },
  { name: "language", label: "Bahasa", type: "text", value: "" },
  { name: "year", label: "Tahun", type: "number", value: "" },
  { name: "creator", label: "Pembuat", type: "text", value: "" },
  { name: "publisher", label: "Penerbit", type: "text", value: "" },
  { name: "contributor", label: "Kontributor", type: "text", value: "" },
  { name: "copyright", label: "Hak Cipta", type: "text", value: "" },
  { name: "format", label: "Format", type: "text", value: "" },
  { name: "source", label: "Sumber", type: "text", value: "" },
  {
    name: "museumEntryYear",
    label: "Tahun Masuk Museum",
    type: "number",
    value: "",
  },
];

interface DynamicFieldsProps {
  existingField?: Record<string, any>;
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ existingField }) => {
  const [fields, setFields] = useState<
    { name: string; label: string; type: string; value: string }[]
  >([]);

  useEffect(() => {
    if (existingField) {
      const matchedFields = FieldMoreInformation.filter(
        (field) => field.name in existingField
      ).map((field) => {
        if (field.type == "date") {
          return {
            ...field,
            value:
              dayjs(existingField[field.name]?.toString()).format(
                "YYYY-MM-DD"
              ) || "",
          };
        } else {
          return {
            ...field,
            value: existingField[field.name]?.toString() || "",
          };
        }
      });
      setFields(matchedFields);
    }
  }, [existingField]);

  const availableFields = FieldMoreInformation.filter(
    (field) => !fields.some((f) => f.name === field.name)
  );
  const [selectedField, setSelectedField] = useState(
    availableFields.length > 0 ? availableFields[0].label : ""
  );

  const handleAddField = () => {
    if (!selectedField) return;
    const field = availableFields.find((f) => f.label === selectedField);
    if (field) {
      setFields([...fields, field]);
      setSelectedField(
        availableFields.length > 1 ? availableFields[1].label : ""
      );
    }
  };

  const handleRemoveField = (label: string) => {
    setFields(fields.filter((field) => field.label !== label));
  };

  return (
    <div className="p-4 md:p-5 space-y-4 -mt-5">
      <div className="flex items-end mb-4 space-x-3">
        <div className="flex-grow">
          <label
            htmlFor="more-information"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Tambah Informasi
          </label>
          <select
            id="more-information"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-big-stone-900 focus:border-big-stone-900 block w-full p-2.5"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            disabled={availableFields.length === 0}
          >
            {availableFields.map((field) => (
              <option key={field.label} value={field.label}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="bg-cod-gray-950 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleAddField}
          disabled={availableFields.length === 0}
        >
          Tambah
        </button>
      </div>

      <div id="more_information" className="grid grid-cols-2 gap-x-10 gap-y-5">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-900 mb-2"
            >
              {field.label}
            </label>

            <div className="flex items-center space-x-3">
              <input
                name={field.name}
                type={field.type}
                className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-big-stone-900 focus:border-big-stone-900 p-2.5"
                placeholder={`Masukkan ${field.label}`}
                value={field.value}
                onChange={(e) => {
                  const updatedFields = fields.map((f) =>
                    f.name === field.name ? { ...f, value: e.target.value } : f
                  );
                  setFields(updatedFields);
                }}
                required
              />

              <button
                type="button"
                className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded-lg cursor-pointer"
                onClick={() => handleRemoveField(field.label)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicFields;
