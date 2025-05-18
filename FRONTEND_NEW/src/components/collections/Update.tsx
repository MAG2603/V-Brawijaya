import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Category from "../../types/Category";
import axios, { AxiosError } from "axios";
import ImageGalery from "./ImageGalery";
import TextareaField from "../input/TextareaField";
import InputField from "../input/InputField";
import SelectField from "../input/SelectField";
import DynamicFields from "./DynamicField";
import Collection from "../../types/Collection";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface UpdateCollectionProps {
  id: string;
  onClose: () => void;
}

const UpdateCollection: React.FC<UpdateCollectionProps> = ({ id, onClose }) => {
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [collection, setCollection] = useState<Collection>({
    _id: "",
    identifier: "",
    name: "",
    year: new Date().getFullYear(),
    category: { _id: "", name: "", description: "" },
    description: "",
    history: "",
    language: "",
    creator: "",
    subject: "",
    publisher: "",
    contributor: "",
    copyright: "",
    date: new Date(),
    format: "",
    source: "",
    museumEntryYear: new Date().getFullYear(),
    images: [],
    audio: { name: "", url: "" },
    createdBy: { _id: "", fullname: "", username: "" },
  });

  const handleChangeField = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    setCollection((prev) =>
      prev
        ? { ...prev, [name]: value }
        : {
            _id: "",
            identifier: "",
            name: "",
            year: new Date().getFullYear(),
            category: { _id: "", name: "", description: "" },
            description: "",
            history: "",
            language: "",
            creator: "",
            subject: "",
            publisher: "",
            contributor: "",
            copyright: "",
            date: new Date(),
            format: "",
            source: "",
            museumEntryYear: new Date().getFullYear(),
            images: [],
            audio: { name: "", url: "" },
            createdBy: { _id: "", fullname: "", username: "" },
            [name]: value,
          }
    );
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  async function handleDelete() {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus koleksi ${collection?.name}?`
    );

    if (!isConfirmed) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/collections/${collection?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) console.error(error.message);
    }
  }

  async function handleRemoveAudio(audioName: string) {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin audio pada koleksi ${collection?.name}?`
    );

    if (!isConfirmed) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/collections/audio/${collection?._id}/${audioName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) console.error(error.message);
    }
  }

  async function getCategories() {
    const response = await axios.get(`http://localhost:5000/api/category`);
    setCategories(response.data);
  }

  async function getCollection() {
    const response = await axios.get(
      `http://localhost:5000/api/collections/${id}`
    );
    setCollection(response.data);
  }

  const excludedFields = [
    "history",
    "description",
    "category",
    "name",
    "images",
    "_id",
    "identifier",
    "createdBy",
    "createdAt",
    "updatedAt",
    "audio",
    "__v",
  ];

  const filteredCollection = Object.fromEntries(
    Object.entries(collection).filter(([key]) => !excludedFields.includes(key))
  );

  useEffect(() => {
    getCategories();
    getCollection();
    try {
      const decodedToken: any = jwtDecode(token ?? "");
      const id = decodedToken.userId;
      setUserId(id);
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    form.append("createdBy", userId);

    images.forEach((image) => {
      form.append(`images`, image);
    });

    try {
      await axios.put(`http://localhost:5000/api/collections/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    collection._id != "" && (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        id="default-modal"
        tabIndex={-1}
        className="overflow-y-auto overflow-x-hidden fixed w-full inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center bg-cod-gray-950/50 z-50 backdrop-blur-sm"
      >
        <form
          method="POST"
          action=""
          className="relative p-4 w-full max-w-7xl max-h-full"
          onSubmit={handleSubmit}
        >
          <div className="relative bg-white rounded shadow-sm ">
            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Detail Koleksi
                </h3>
              </div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded text-sm w-8 h-8 ms-auto inline-flex justify-center items-center cursor-pointer"
                data-modal-hide="default-modal"
                onClick={() => onClose()}
              >
                <X />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4 -mt-5">
              <div className="col-span-2">
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Foto
                </label>
                <ImageGalery
                  id_collection={collection?._id}
                  existingImages={collection?.images || []}
                  onImagesChange={handleImagesChange}
                />
              </div>
            </div>
            <div className="grid grid-col-1 lg:grid-cols-2">
              <InputField
                id="name"
                name="name"
                label="Nama"
                placeholder="Masukkan nama koleksi"
                required
                value={collection?.name || ""}
                onChange={({ name, value }) =>
                  handleChangeField({ name, value })
                }
              />
              <SelectField
                id="category"
                name="category"
                label="Kategori"
                options={categories}
                value={collection?.category._id}
                onChange={({ name, value }) =>
                  handleChangeField({ name, value })
                }
              />
              <TextareaField
                id="description"
                label="Deskripsi"
                name="description"
                placeholder="Tuliskan deskripsi koleksi..."
                value={collection?.description || ""}
                onChange={({ name, value }) =>
                  handleChangeField({ name, value })
                }
              />
              <TextareaField
                id="history"
                label="Sejarah"
                name="history"
                placeholder="Tuliskan sejarah koleksi..."
                value={collection?.history || ""}
                onChange={({ name, value }) =>
                  handleChangeField({ name, value })
                }
              />
            </div>
            <div className="p-4 md:p-5 space-y-4 -mt-5">
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="file_input"
                  >
                    Audio Narasi
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
                    id="file_input"
                    type="file"
                    accept="audio/*"
                    name="audio"
                  />
                </div>
                <div>
                  {collection.audio?.url && (
                    <div>
                      <p className="block mb-2 text-sm font-medium text-gray-900">
                        Audio Narasi Yang Digunakan
                      </p>
                      <div className="grid grid-cols-6 gap-x-3">
                        <audio controls className="col-span-5 w-full">
                          <source
                            src={collection.audio.url}
                            type="audio/mpeg"
                          />
                          Browser Anda tidak mendukung elemen audio.
                        </audio>
                        <button
                          type="button"
                          className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded-lg cursor-pointer flex justify-center items-center"
                          onClick={() =>
                            handleRemoveAudio(collection.audio.name)
                          }
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}
                  {!collection.audio?.url && (
                    <p className="mt-9">Audio Narasi Tidak Tersedia</p>
                  )}
                </div>
              </div>
            </div>
            <DynamicFields existingField={filteredCollection} />
            <div className="p -4 md:p-5 -mt-2">
              <button
                type="submit"
                className="button bg-cod-gray-950 text-white w-full py-2.5 font-semibold rounded cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
            <div className="p -4 md:p-5 -mt-7">
              <button
                type="button"
                className="button bg-red-800 text-white w-full py-2.5 font-semibold rounded cursor-pointer"
                onClick={handleDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    )
  );
};

export default UpdateCollection;
