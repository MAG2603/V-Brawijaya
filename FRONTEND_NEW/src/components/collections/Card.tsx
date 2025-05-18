import Collection from "../../types/Collection";
import { useState, useCallback } from "react";
import UpdateCollection from "./Update";
import Detail from "./Detail";
import { motion } from "framer-motion";

interface CardProps {
  index: number;
  data: Collection;
  onUpdate?: () => void;
}

const Card: React.FC<CardProps> = ({ index, data, onUpdate }) => {
  const token = Boolean(localStorage.getItem("token"));
  const [showDetail, setShowDetail] = useState(false);

  const handleOnClose = useCallback(() => {
    onUpdate?.();
    setShowDetail(false);
  }, [onUpdate]);

  return (
    <>
      <motion.div
        layoutId={`card-${data._id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="group cursor-pointer perspective-[1000px]"
        onClick={() => setShowDetail((prev) => !prev)}
      >
        <motion.div
          whileHover={{ scale: 1.02, rotateY: 5 }}
          className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm transition-all duration-500"
        >
          <div className="relative h-80">
            <img
              src={data.images?.[0]?.url || "/blank.png"}
              alt={data.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cod-gray-950 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-6"
            >
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {data.name}
                </h3>
                {data.category && (
                  <div className="flex space-x-3">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">
                      {data.category.name}
                    </span>
                  </div>
                )}
                <p className="text-gray-300 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {data.description?.slice(0, 50) || "Tidak ada deskripsi"} ...
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {showDetail &&
        (token ? (
          <UpdateCollection id={data._id} onClose={handleOnClose} />
        ) : (
          <Detail id={data._id} onClose={() => setShowDetail(false)} />
        ))}
    </>
  );
};

export default Card;
