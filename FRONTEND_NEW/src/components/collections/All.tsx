import { useEffect, useState, useCallback } from "react";
import Collection from "../../types/Collection";
import axios from "axios";
import FormSearch from "../input/FormSearch";
import Card from "./Card";
import Title from "../utils/Title";
import Loading from "../utils/Loading";
import AddCollection from "./Add";

const AllCollection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addCollection, setAddCollection] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axios.get(
        "http://localhost:5000/api/collections"
      );
      if (status === 200) setCollections(data);
    } catch (error) {
      console.error("Gagal mengambil data koleksi:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  return (
    <>
      {isLoading && <Loading />}

      <Title
        button={{
          name: "Tambah Koleksi",
          onClick: () => setAddCollection((prev) => !prev),
        }}
      >
        Semua Koleksi Museum
      </Title>

      <FormSearch
        onResponse={(newCollections) => setCollections([...newCollections])}
      />

      {collections.length === 0 && (
        <p className="mt-5 text-white">Tidak Ada Koleksi</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((item) => (
          <Card
            key={item._id}
            index={collections.findIndex((col) => col._id === item._id)}
            data={item}
            onUpdate={getCollections}
          />
        ))}
      </div>

      {addCollection && (
        <AddCollection
          onClose={() => setAddCollection(false)}
          onSuccess={getCollections}
        />
      )}
    </>
  );
};

export default AllCollection;
