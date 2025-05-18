import axios, { AxiosError } from "axios";
import { Info, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DetailUser {
  id: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DetailUser: React.FC<DetailUser> = ({ id, onClose, onSuccess }) => {
  const token = localStorage.getItem("token");
  const [fullname, setFullname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function getUser() {
      const response = await axios.get(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setFullname(data?.fullname);
      setUsername(data?.username);
    }

    getUser();
  }, []);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus pengguna ${fullname}?`
    );

    if (!isConfirmed) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onClose();
      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) setError(error.message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        {
          fullname,
          username,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onClose();
      onSuccess();
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
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed inset-0 flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 ">
              Detail Pengguna
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
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan nama lengkap"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan nama pengguna"
                  required
                  value={username}
                  readOnly
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Kata Sandi
                </label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                className="text-white bg-cod-gray-950 w-full inline-flex justify-center items-center bg-big-stone-900 hover:bg-big-stone-950 font-medium rounded text-sm px-4 py-3 text-center cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                className="text-white w-full inline-flex justify-center items-center bg-red-800 hover:bg-red-900 font-medium rounded text-sm px-5 py-2.5 text-center cursor-pointer"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailUser;
