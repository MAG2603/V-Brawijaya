import { motion } from "framer-motion";

export const Welcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 flex items-center justify-center bg-cod-gray-950 z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-white"
      >
        <motion.div
          transition={{ duration: 2, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <img src="/logo.png" className="h-52" alt="logo" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent"
        >
          Selamat Datang di Museum Brawijaya
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-300"
        >
          Menjelajahi Sejarah Perjuangan Bangsa
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
