import React, { useContext } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { LikedContext } from "../../context/LikedContext";
import { slugify } from "../../utils/slugify";

const ProductCard = ({ product, basePath }) => {
  const { likedItems, toggleLike } = useContext(LikedContext);
const productSlug = slugify(`${product.name} ${product.subCategory}`);

  return (
    <div className="cursor-pointer  w-[175px] sm:w-[190px] max-w-[200px]  p-1 relative pb-3 mb-1 hover:shadow-sm transition-all duration-200 bg-white rounded-sm ">
      <div
        onClick={() => toggleLike(product._id)}
        className="absolute right-3 top-3 rounded-full w-7 h-7 flex justify-center items-center backdrop-blur-lg shadow-md bg-white bg-opacity-95 z-10 "
      >
         {likedItems[product._id] ? (
          <FavoriteIcon className={`!text-[16px] text-purple-900 transition-all duration-200 ${likedItems[product._id] ? 'ping-once': 'animate-none'}`} />
        ) : (
          <FavoriteBorderIcon className="text-[var(--secondary)] transition-all duration-200 !text-[16px]" />
        )}
      </div>

      <Link to={`${basePath}/product-details/${product.category}/${productSlug}/?id=${product._id}`}>
        <div className="bg-transparent relative ">
          <img
            className="w-full h-[230px] object-top rounded object-cover m-auto"
            src={product.images[0]}
            // alt={product.name}
          />

          <div className="my-1">
           { product.brand && <p className="font-semibold opacity-50 text-left text-[10px] ml-2 tracking-wide uppercase">{product.brand}</p> } 
            <p className="text-left !text-[0.7rem] ml-2 text-xs truncate poppins tracking-wide ">{product.name}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-[0.9rem] justify-start ">
              <p className="font-semibold text-[1rem] ml-2 rubik">₹{product.price}</p>
              <p className="line-through opacity-50 text-xs rubik">₹{product.mrpPrice}</p>
              <p className="text-green-600 font-semibold text-xs rubik">{((product.mrpPrice-product.price)/(product.mrpPrice)*100).toFixed(2)}% off</p>

                  
            </div>

            <div className="my-0 w-full mt-2 poppins tracking-wider">

              {/* {product.variants.stock === 0 ? <button className="!hover:bg-gray-600 transition-all duration-100 text-[0.7rem] bg-black px-5 text-white rounded-full text-center p-1 w-[85%]" disabled>
                Out Of Stock
              </button>:<button className="!hover:bg-gray-600 transition-all duration-100 text-[0.7rem] bg-black px-5 text-white rounded-full text-center p-1 w-[85%]">
                Buy
              </button>} */}

         
             
            </div>


         
          </div>

              {product.variants?.every(variant => variant.stock === 0) ? (<button className="!hover:bg-gray-600 transition-all duration-100 text-[0.7rem] bg-[var(--blfaded)] px-5 text-white text-center p-1 cursor-not-allowed absolute top-[37%] right-[0%] w-full bg-opacity-80 backdrop-blur-[2px]">
                Sold Out
              </button>): (
                
                
              //   <button className="!hover:bg-gray-600 transition-all duration-100 text-[0.7rem] bg-[var(--primary)] px-5 text-white rounded text-center p-1 w-[85%]">
              //   Buy
              // </button>
            
            
            '') }

        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
