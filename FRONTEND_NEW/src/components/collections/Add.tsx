import { X } from "lucide-react";
import { FormEvent, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

import Category from "../../types/Category";
import ImageGalery from "./ImageGalery";
import TextareaField from "../input/TextareaField";
import InputField from "../input/InputField";
import SelectField from "../input/SelectField";
import DynamicFields from "./DynamicField";

interface AddCollectionProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface DecodedToken {
  userId: string;
}

const AddCollection: React.FC<AddCollectionProps> = ({
  onClose,
  onSuccess,
}) => {
  const [userId, setUserId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleImagesChange = useCallback((newImages: File[]) => {
    setImages(newImages);
  }, []);

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decodedToken.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [fetchCategories]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }

    const form = new FormData(event.currentTarget);
    form.append("createdBy", userId);

    images.forEach((image) => {
      form.append("images", image);
    });

    if (!audioFile) {
      form.delete("audio");
    }

    try {
      await axios.post("http://localhost:5000/api/collections", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-y-auto overflow-x-hidden fixed w-full inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
    >
      <form
        className="relative p-4 w-full max-w-7xl max-h-full"
        onSubmit={handleSubmit}
      >
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
            <h3 className="text-xl font-bold text-gray-900">Tambah Koleksi</h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center"
              onClick={onClose}
            >
              <X />
              <span className="sr-only">Tutup</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 md:p-5 ">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Foto
              </label>
              <ImageGalery
                existingImages={[]}
                onImagesChange={handleImagesChange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                id="name"
                name="name"
                label="Nama"
                placeholder="Masukkan nama koleksi"
                required
              />

              <SelectField
                name="category"
                id="category"
                label="Kategori"
                options={categories}
              />

              <TextareaField
                name="description"
                id="description"
                label="Deskripsi"
                placeholder="Tuliskan deskripsi koleksi..."
              />

              <TextareaField
                name="history"
                id="history"
                label="Sejarah"
                placeholder="Tuliskan sejarah koleksi..."
              />
            </div>

            <div className="p-4 md:p-5">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Audio Narasi
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                type="file"
                accept="audio/*"
                name="audio"
                onChange={handleAudioChange}
              />
            </div>

            <DynamicFields />

            <div className="p-4 md:p-5 ">
              <button className="bg-cod-gray-950 text-white w-full py-3 font-semibold rounded-lg hover:bg-cod-gray-800">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCollection;
