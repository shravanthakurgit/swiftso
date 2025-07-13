import { Link } from 'react-router-dom';
import { IoIosMan, IoIosWoman } from "react-icons/io";
import { FaChild } from "react-icons/fa";

const Category = () => {
  const category = {
    pages: [
      { category: "men", href: "/shop?category=men", icon: IoIosMan, color: "text-blue-600", bg: "bg-blue-100" },
      { category: "women", href: "/shop?category=women", icon: IoIosWoman, color: "text-pink-600", bg: "bg-pink-100" },
      { category: "kids", href: "/shop/?category=kids", icon: FaChild, color: "text-yellow-600", bg: "bg-yellow-100" },
    ],
  };

  return (
    <div className="flex gap-4 justify-center items-center w-full flex-wrap py-4">
      {category.pages.map((page, index) => {
        const Icon = page.icon;
        return (
          <Link to={page.href} key={index}>
            <div
              className={`flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-200 shadow-sm transition duration-200 hover:shadow-md hover:scale-[1.03] cursor-pointer ${page.bg}`}
            >
              <Icon className={`text-xl ${page.color}`} />
              <span className="capitalize text-sm font-semibold text-gray-700">{page.category}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Category;
