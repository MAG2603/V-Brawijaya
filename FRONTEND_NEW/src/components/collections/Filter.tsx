import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Collection from "../../types/Collection";
import FormSearch from "../input/FormSearch";
import Card from "./Card";
import Title from "../utils/Title";
import Loading from "../utils/Loading";
import AddCollection from "./Add";

interface FilterCollectionProps {
  to: string;
}

const FilterCollection: React.FC<FilterCollectionProps> = ({ to }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addCollection, setAddCollection] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = useCallback(async () => {
    if (!to) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/collections?category=${to}`
      );
      setCollections([...response.data]);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [to]);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  return (
    <>
      {isLoading && <Loading />}
      <Title
        button={{
          name: "Tambah Koleksi",
          onClick: () => setAddCollection(!addCollection),
        }}
      >
        Semua Koleksi {to ? to[0].toUpperCase() + to.slice(1) : ""}
      </Title>

      <FormSearch
        category={to}
        onResponse={(newCollections: Collection[]) =>
          setCollections([...newCollections])
        }
      />

      {collections.length === 0 && (
        <p className="mt-5 text-white">Tidak Ada Koleksi</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Card
            key={collection._id}
            index={collections.findIndex((col) => col._id === collection._id)}
            data={collection}
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

export default FilterCollection;
