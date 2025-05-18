import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface LogoutProps {
  onClick: () => void;
  onCancel: () => void;
}

const Logout: React.FC<LogoutProps> = ({ onClick, onCancel }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      id="popup-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed inset-0 flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded shadow-sm p-3">
          <div className="p-4 md:p-5 text-center">
            <Info className="mx-auto mb-4 w-16 h-16" />
            <h3 className="mb-5 text-lg font-normal">
              Apakah anda ingin keluar ?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="w-full text-white bg-cod-gray-950         font-medium rounded text-sm px-4 py-3 text-center hover:cursor-pointer"
                onClick={() => onClick()}
              >
                Ya, Keluar
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="w-full text-white bg-cod-gray-900 hover:bg-cod-gray-800 font-medium rounded text-sm px-4 py-3 text-center hover:cursor-pointer"
                onClick={() => onCancel()}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logout;
