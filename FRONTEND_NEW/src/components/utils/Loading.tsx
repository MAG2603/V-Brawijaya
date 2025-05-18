import { motion } from "framer-motion";

const Loading: React.FC = () => {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed inset-0 flex items-center justify-center bg-cod-gray-950/80 z-40 backdrop-blur-sm">
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center text-amber-500 font-semibold"
        >
          Loading
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
