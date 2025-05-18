import { useEffect, useState } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import Login from "./components/auth/Login";
import Sidebar from "./components/layouts/Sidebar";
import AllCategory from "./components/category/All";
import AllUser from "./components/user/All";
import AllCollection from "./components/collections/All";
import FilterCollection from "./components/collections/Filter";
import { AnimatePresence } from "framer-motion";
import { Welcome } from "./components/layouts/Welcome";

function App() {
  const [activeComponent, setActiveComponent] = useState<{
    id: string;
    name: string;
  }>({
    id: "all",
    name: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("login")) {
      if (!token) setShowModal(true);
    } else {
      setShowWelcome(true);
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3500);

      return () => {
        clearTimeout(welcomeTimer);
      };
    }
  }, [location.search]);

  return (
    <div className="font-poppins">
      <AnimatePresence>{showWelcome && <Welcome />}</AnimatePresence>

      <Sidebar
        onChange={(component: { id: string; name: string }) =>
          setActiveComponent(component)
        }
      />

      <div className="p-4 sm:ml-72">
        <div className="p-5 border-gray-200">
          {activeComponent.id == "all" && <AllCollection />}
          {activeComponent.id == "by_category" && (
            <FilterCollection to={activeComponent.name} />
          )}
          {activeComponent.id == "category" && <AllCategory />}
          {activeComponent.id == "user" && <AllUser />}
        </div>
      </div>

      {showModal && <Login onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
