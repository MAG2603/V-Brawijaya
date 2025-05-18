import { Plus } from "lucide-react";

interface TitleProps {
  children: React.ReactNode;
  button: {
    name: string;
    onClick: () => void;
  };
}

const Title: React.FC<TitleProps> = ({ children, button }) => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-white">{children}</h2>
      {token && token != "" && (
        <button
          id={button.name}
          className="btn bg-cod-gray-800 hover:bg-cod-gray-900 px-3 py-2 text-white rounded cursor-pointer"
          onClick={() => button.onClick()}
        >
          <Plus />
        </button>
      )}
    </div>
  );
};

export default Title;
