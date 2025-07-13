import { FiMenu } from "react-icons/fi";

const Navbar = ({ setToken, onMenuClick }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={onMenuClick}>
          <FiMenu className="text-2xl" />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken("");
        }}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
