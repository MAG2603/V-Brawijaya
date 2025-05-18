import axios, { AxiosError } from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Collection from "../../types/Collection";

interface SearchProps {
  category?: string;
  onResponse: (data: Collection[]) => void;
}

const FormSearch: React.FC<SearchProps> = ({ category = "", onResponse }) => {
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    try {
      async function getCollections() {
        const query = new URLSearchParams({
          search,
          category: category !== "" ? category : "",
        }).toString();

        const response = await axios.get(
          `http://localhost:5000/api/collections?${query}`
        );
        const data = await response.data;
        onResponse(data);
      }

      getCollections();
    } catch (error) {
      if (error instanceof AxiosError) console.error(error.message);
    }
  }, [search]);

  return (
    <form className="mx-auto w-full my-6">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <Search className="text-white" />
        </div>
        <input
          type="search"
          id="default-search"
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300"
          placeholder="Ketikkan Nama Koleksi"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
};

export default FormSearch;
