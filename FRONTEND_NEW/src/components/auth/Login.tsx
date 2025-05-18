import { Info, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../state/useAuth";

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="authentication-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed inset-0 flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
    >
      <div className="bg-white relative w-full max-w-md max-h-full border rounded">
        <div className="relative text-cod-gray-950 rounded">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-xl font-semibold">Masuk</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
              data-modal-hide="authentication-modal"
              onClick={() => onClose()}
            >
              <X />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <form
              className="space-y-4"
              action=""
              method="POST"
              onSubmit={handleSubmit}
            >
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
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium"
                >
                  Nama Pengguna
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  placeholder="Masukkan nama pengguna"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium"
                >
                  Kata Sandi
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-cod-gray-950 text-sm rounded focus:ring-cod-gray-950 block w-full px-4 py-3"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-cod-gray-950 w-full inline-flex justify-center items-center bg-big-stone-900 hover:bg-big-stone-950 font-medium rounded text-sm px-4 py-3 text-center cursor-pointer"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
