import { AxiosError } from "axios";
import { Info, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import useCategoryStore from "../../state/useCategory";

interface AddCategoryProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { addCategory } = useCategoryStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addCategory({ name, description });
    try {
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) setError(error.message);
    }
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="crud-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed inset-0 flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Tambah Kategori
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
              data-modal-toggle="crud-modal"
              onClick={() => onClose()}
            >
              <X />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            {error != "" && (
              <div
                className="flex items-center p-4 mb-4 text-sm text-red-800 rounded bg-red-50 space-x-3"
                role="alert"
              >
                <Info />
                <span className="sr-only">Info</span>
                <div>{error}</div>
              </div>
            )}
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan nama"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan deskripsi"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="text-white bg-cod-gray-950 w-full inline-flex justify-center items-center bg-big-stone-900 hover:bg-big-stone-950 font-medium rounded text-sm px-4 py-3 text-center cursor-pointer"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCategory;
