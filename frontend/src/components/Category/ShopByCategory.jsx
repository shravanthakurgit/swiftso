import { 
  Shirt,  
  Snowflake, 
  Sun,
  User,
  Baby
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GrUserFemale } from "react-icons/gr";
import { PiPantsLight } from "react-icons/pi";
import Title from '../Title';

const categoryData = [
  {
    value: "men",
    label: "Men",
    icon: <User className="w-6 h-6" />,
    subcategories: [
      { value: "topwear", label: "Topwear", icon: <Shirt className="w-6 h-6" /> },
      { value: "bottomwear", label: "Bottomwear", icon: <PiPantsLight className="w-6 h-6" /> },
      { value: "winterwear", label: "Winterwear", icon: <Snowflake className="w-6 h-6" /> },
      { value: "innerwear", label: "Summerwaer", icon: <Sun className="w-6 h-6" /> }
    ]
  },
  {
    value: "women",
    label: "Women",
    icon: <GrUserFemale className="w-6 h-6" />,
    subcategories: [
      { value: "topwear", label: "Topwear", icon: <Shirt className="w-6 h-6" /> },
      { value: "bottomwear", label: "Bottomwear", icon: <PiPantsLight className="w-6 h-6" /> },
      { value: "winterwear", label: "Winterwear", icon: <Snowflake className="w-6 h-6" /> },
      { value: "innerwear", label: "Summerwear", icon: <Sun className="w-6 h-6" /> }
    ]
  },
  {
    value: "kids",
    label: "Kids",
    icon: <Baby className="w-6 h-6" />,
    subcategories: [
      { value: "topwear", label: "Topwear", icon: <Shirt className="w-6 h-6" /> },
      { value: "bottomwear", label: "Bottomwear", icon: <PiPantsLight className="w-6 h-6" /> },
      { value: "winterwear", label: "Winterwear", icon: <Snowflake className="w-6 h-6" /> },
      { value: "innerwear", label: "Summerwear", icon: <Sun className="w-6 h-6" /> }
    ]
  }
];

const ShopByCategory = () => {
  return (
    <div className="px-4 py-6 w-full mx-auto font-sans">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center monst mt-10">Shop by Category<Title title1='o o o o o' / ></h2>
      
      <div className="flex flex-col gap-4">
        {categoryData.map((category) => (
          <div key={category.value} className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden font-semibold monst  ">
            
            {/* Main Category Header */}
            <div className="flex items-center p-4">
              <div className="w-12 h-12 flex items-center justify-center bg-yellow-50 rounded-full text-yellow-600 text-md ">
                {category.icon}
              </div>
              <h3 className="ml-3 text-md text-gray-700 ">{category.label}</h3>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 border-t border-gray-100">
              {category.subcategories.map((subcategory) => (
                <Link
                  to={`/shop?category=${category.value}&subCategory=${subcategory.value}`}
                  key={`${category.value}-${subcategory.value}`}
                  className="flex flex-col items-center p-3 bg-pink-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-50 rounded-full mb-2 text-purple-600">
                    {subcategory.icon}
                  </div>
                  <span className="text-xs  text-gray-700 text-center">
                    {subcategory.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;