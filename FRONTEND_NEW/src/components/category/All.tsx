import { useEffect, useState } from "react";
import Title from "../utils/Title";
import AddCategory from "./Add";
import DetailCategory from "./Detail";
import classNames from "classnames";
import Loading from "../utils/Loading";
import useCategoryStore from "../../state/useCategory";

const AllCategory: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [updateCategory, setUpdateCategory] = useState<string>("");

  const { categories } = useCategoryStore();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <Title
        button={{
          name: "Tambah Kategori",
          onClick: () => setAddCategory(!addCategory),
        }}
      >
        Kategori
      </Title>
      <div className="relative overflow-x-auto mt-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs uppercase text-gray-400 border-b border-cod-gray-900 bg-cod-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {categories &&
              categories.length > 0 &&
              categories.map((category, index) => (
                <tr
                  key={index}
                  className={classNames("border-cod-gray-900 text-white", {
                    "border-b": index + 1 < categories.length,
                  })}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap"
                  >
                    {category.name}
                  </th>
                  <td className="px-6 py-4">
                    {category.description.slice(0, 100)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      id={category._id}
                      className="btn bg-cod-gray-900 hover:bg-cod-gray-800 px-3 py-2 text-white rounded cursor-pointer"
                      onClick={() => {
                        if (!category._id) {
                          return;
                        }
                        setUpdateCategory(category._id);
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {updateCategory && (
        <DetailCategory
          id={updateCategory}
          onClose={() => setUpdateCategory("")}
        />
      )}
      {addCategory && (
        <AddCategory onClose={() => setAddCategory(!addCategory)} />
      )}
    </>
  );
};

export default AllCategory;
