import { useState, useEffect } from "react";
import { Trash, Plus } from "lucide-react";
import axios from "axios";

interface ImageGalleryProps {
  id_collection?: string;
  existingImages?: { _id: string; name: string; url: string }[];
  onImagesChange: (images: File[]) => void; // New prop
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  id_collection,
  existingImages = [],
  onImagesChange,
}) => {
  const token = localStorage.getItem("token");
  const [images, setImages] = useState(existingImages);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    onImagesChange(newImages);
  }, [newImages, onImagesChange]);

  // Perbaikan: Perbarui images hanya saat existingImages berubah
  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus gambar ini?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/collections/image/${id_collection}/${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Perbaikan: Hapus gambar dari state & update existingImages
      const updatedImages = images.filter((image) => image._id !== id);
      setImages(updatedImages);
    } catch (error) {
      console.error("Gagal menghapus gambar:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {images.length > 0 &&
        images.map((image) => (
          <div key={image._id} className="relative group">
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() =>
                handleRemoveExistingImage({ id: image._id, name: image.name })
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}

      {newImages.map((file, index) => (
        <div key={index} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt="New Upload"
            className="w-full h-32 object-cover rounded border"
          />
          <button
            onClick={() => handleRemoveNewImage(index)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}

      {images.length + newImages.length < 5 && (
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          <Plus size={32} className="text-gray-400" />
        </label>
      )}
    </div>
  );
};

export default ImageGallery;
