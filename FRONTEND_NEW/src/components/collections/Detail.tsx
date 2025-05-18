import Collection from "../../types/Collection";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PauseCircle,
  PlayCircle,
  Tag,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import dayjs from "dayjs";

interface DetailProps {
  id: string;
  onClose: () => void;
}

const Detail: React.FC<DetailProps> = ({ id, onClose }) => {
  const [collection, setCollection] = useState<Collection | null>();
  const [isNarrating, setIsNarrating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function getCollection() {
    const response = await axios.get(
      `http://localhost:5000/api/collections/${id}`
    );
    if (response.data) setCollection(response.data);
  }

  useEffect(() => {
    getCollection();
  }, [id]);

  const fields = collection && [
    { label: "Subjek", value: collection.subject },
    { label: "Kontibutor", value: collection.contributor },
    { label: "Bahasa", value: collection.language },
    { label: "Pembuat", value: collection.creator },
    { label: "Penerbit", value: collection.publisher },
    { label: "Hak Cipta", value: collection.copyright },
    { label: "Format", value: collection.format },
    { label: "Sumber", value: collection.source },
    { label: "Tahun Masuk", value: collection.museumEntryYear },
    { label: "Tahun", value: collection.year },
    {
      label: "Tanggal Dibuat / Ditemukan",
      value: collection.date && dayjs(collection.date).format("DD/MM/YYYY"),
    },
  ];

  const toggleNarration = () => {
    if (isNarrating) {
      setIsNarrating(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsNarrating(true);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    collection && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center py-10 bg-cod-gray-950/80 z-50 backdrop-blur-sm"
        onClick={() => onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="overflow-y-visible no-scrollbar bg-gradient-to-br from-white/10 to-transparent rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="relative h-56 overflow-hidden md:h-96"
            >
              <ImageCarousel images={collection.images} />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                {collection.audio && (
                  <>
                    <button
                      onClick={toggleMute}
                      className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <button
                      onClick={toggleNarration}
                      className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isNarrating ? (
                        <PauseCircle size={24} />
                      ) : (
                        <PlayCircle size={24} />
                      )}
                    </button>
                    <audio ref={audioRef} src={collection.audio.url} />
                  </>
                )}
                <button
                  onClick={() => onClose()}
                  className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  {collection.name}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-3 text-amber-400"
                  >
                    <Tag size={20} />
                    <span>{collection.category.name}</span>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-amber-400 mb-3">
                    Deskripsi
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {collection.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">
                    Sejarah
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {collection.history}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                    Informasi Lebih Lanjut
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(fields || [])
                      .filter((field) => field.value != null)
                      .map((field) => (
                        <li
                          key={field.label}
                          className="flex items-center space-x-2 text-gray-300"
                        >
                          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                          <span>
                            {field.label} : {field.value}
                          </span>
                        </li>
                      ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

export default Detail;
