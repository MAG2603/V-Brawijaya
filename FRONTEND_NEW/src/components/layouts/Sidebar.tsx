import { Layers2, LogOut, Menu, User } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import Logout from "../auth/Logout";
import useCategoryStore from "../../state/useCategory";
import classNames from "classnames";
import useAuthStore from "../../state/useAuth";

interface SidebarProps {
  onChange: ({ id, name }: { id: string; name: string }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChange }) => {
  const token = localStorage.getItem("token");
  const { categories, fetchCategories } = useCategoryStore();
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<string>("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOnChangeComponent = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;
    onChange({
      id: target.id,
      name: target.id != "all" ? target.name : "",
    });
    setIsActive(target.name);
  };

  const handleLogout = () => {
    const clearToken = useAuthStore.getState().clearToken;
    clearToken();
    window.location.href = "/";
  };

  return (
    <>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Menu />
        <span className="sr-only">Open sidebar</span>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-cod-gray-950"
        aria-label="sidebar"
      >
        <div className="h-full py-4 overflow-y-auto">
          <div className="px-4 border-b border-cod-gray-900 mb-4 flex justify-center">
            <a href="#" className="flex items-center ps-2.5 mb-5">
              <img src="/logo.png" className="h-6 me-3 sm:h-7" alt="Logo" />
              <span className="self-center text-base font-semibold whitespace-nowrap text-white">
                V-Brawijaya
              </span>
            </a>
          </div>
          <p className="text-cod-gray-300 px-4 font-semibold text-xs mb-3">
            KATEGORI
          </p>
          <ul className="space-y-2 px-4">
            <li>
              <button
                name="all"
                type="button"
                id="all"
                className={classNames(
                  "flex items-center w-full p-4 transition duration-300 rounded-xl group text-white cursor-pointer border-0",
                  {
                    "bg-brown-tumbleweed-950 text-brown-tumbleweed-600 border border-brown-tumbleweed-900":
                      isActive == "all",
                    "hover:bg-white/5": isActive != "all",
                  }
                )}
                onClick={handleOnChangeComponent}
              >
                <span>Semua Koleksi</span>
              </button>
            </li>
            {categories.length > 0 &&
              categories.map((category, index) => (
                <li key={index}>
                  <button
                    name={category.name.toLocaleLowerCase()}
                    type="button"
                    id="by_category"
                    className={classNames(
                      "flex items-center w-full p-4 transition duration-300 rounded-xl group text-white cursor-pointer",
                      {
                        "bg-brown-tumbleweed-950 text-brown-tumbleweed-600 border-brown-tumbleweed-900 border-0":
                          isActive == category.name.toLocaleLowerCase(),
                        "hover:bg-white/5":
                          isActive != category.name.toLocaleLowerCase(),
                      }
                    )}
                    onClick={handleOnChangeComponent}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            {token && token != "" && (
              <>
                <li>
                  <button
                    name="category"
                    type="button"
                    id="category"
                    className={classNames(
                      "flex items-center w-full p-4 transition duration-75 rounded-xl border-none group text-white cursor-pointer",
                      {
                        "bg-violet-950 text-violet-300 border border-violet-900":
                          isActive == "category",
                        "hover:bg-white/5": isActive != "category",
                      }
                    )}
                    onClick={handleOnChangeComponent}
                  >
                    <Layers2 />
                    <span className="ms-3">Kategori</span>
                  </button>
                </li>
                <li>
                  <button
                    name="user"
                    type="button"
                    id="user"
                    className={classNames(
                      "flex items-center w-full p-4 transition duration-75 rounded-xl  border-none group text-white cursor-pointer",
                      {
                        "bg-violet-950 text-violet-300 border-violet-900 border":
                          isActive == "user",
                        "hover:bg-white/5": isActive != "user",
                      }
                    )}
                    onClick={handleOnChangeComponent}
                  >
                    <User />
                    <span className="ms-3">Pengguna</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    id="all"
                    className="flex items-center w-full p-4 transition duration-75 rounded-xl  border-none group text-white cursor-pointer hover:bg-white/5"
                    onClick={() => setShowLogout(!showLogout)}
                  >
                    <LogOut />
                    <span className="ms-3">Keluar</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>

      {showLogout && (
        <Logout
          onClick={handleLogout}
          onCancel={() => setShowLogout(!showLogout)}
        />
      )}
    </>
  );
};

export default Sidebar;
