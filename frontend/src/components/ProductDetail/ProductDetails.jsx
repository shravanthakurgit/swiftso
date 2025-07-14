
import { useContext, useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaStar,
} from "react-icons/fa6";
import { useStore } from "../../context/StoreContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useLocation } from "react-router-dom";
import ProductCarousel from "./ProductCarousel";
import { useCart } from "../../context/CartContext";
// import { slugify } from "../../utils/slugify";
import { TbTruckReturn } from "react-icons/tb";
import { LikedContext } from "../../context/LikedContext";
import ReviewForm from "../User/ReviewForm";

import { FaStarHalfAlt, FaRegStar, FaTrash } from "react-icons/fa";
// import { backendUrl } from "../../utils/backendUrl";
import axios from "axios";
import { currentUserId, token } from "../../utils/Token";
import Error from "../../utils/Error";
import { useAuth } from "../../context/AuthContext";
import RelatedProducts from "../Store/RelatedProducts";
import ServiceCommitment from "../../utils/ServiceCommitment";
import ShareProduct from "../../utils/ShareProduct";
import ShopByCategory from "../Category/ShopByCategory";



const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <FaStar
          key={i}
          className="text-black border p-[1.2px] border-slate-200 rounded shadow-sm bg-white "
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          className="text-black border p-[1.2px] border-slate-200 rounded shadow-sm bg-white"
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          className="text-gray-300   p-[1.2px] border-slate-200 rounded "
        />
      );
    }
  }
  return stars;
};

const renderUserStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <FaStar
          key={i}
          className="text-black border p-[1.2px] border-slate-200 rounded shadow-sm bg-white text-[10px] "
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          className="text-black border p-[1.2px] border-slate-200 rounded shadow-sm bg-white text-[10px]"
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          className="text-gray-300   p-[1.2px] border-slate-200 rounded text-[10px]"
        />
      );
    }
  }
  return stars;
};

const ProductDetails = () => {
  const { likedItems, toggleLike } = useContext(LikedContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("id");
  const { products } = useStore();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  const [productData, setProductData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  const [fullURL, setFullURL] = useState("");
  const [isAdded, setIsAdded] = useState(false);



  useEffect(() => {
    setFullURL(window.location.href);
    console.log("full url" + fullURL)

  }, []);

  useEffect(() => {
    // setFullURL(window.location.href);
    console.log("full url" + fullURL)

  }, []);

  // other method tp fetch product data from single api

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await fetch(`${backendUrl}/api/product/single?productId=${productId}`);
  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.message || 'Something went wrong');
  //       }

  //       setProductData(data.product);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (productId) {
  //     fetchProduct();
  //   }
  // }, [productId]);

  useEffect(() => {
    const product = products?.find((item) => item._id === productId);


    if (product) {
      setProductData(product);
      setSelectedVariant(null); 
      setSelectedImage(product.images?.[0] || null);
    }
  }, [productId, products,token,currentUserId]);



  const isOutOfStock = productData?.variants?.every(
    (variant) => variant.stock === 0
  );
  const isVariantOutOfStock = selectedVariant?.stock === 0;

  const { addToCart } = useCart();

const handleAddToCart = async () => {
  if (!selectedVariant) return;

  const newItem = {
    productId: productData._id,
    name: productData.name,
    price: selectedVariant.price || productData.price,
    category: productData.category,
    subCategory: productData.subCategory,
    quantity: 1,
    image: productData.images?.[0],
    size: selectedVariant.size,
    url: fullURL,
  };


  await addToCart(newItem); 

  setIsAdded(true);
  setTimeout(() => {
    setIsAdded(false);
  }, 2000);
};

  if (!productData) return <Error message='Somting Went Wrong'/>;

  const displayedPrice =
    selectedVariant?.price > 0 ? selectedVariant.price : productData.price;



    const handleRemoveReview = async ()=>{
      
         try {
     const response = await axios.post(
  `${backendUrl}/api/product/remove-review`,
  {productId:productData._id}, 
  {
    withCredentials: true, 
  }
);
     
         if(response){
          alert("Removed SuccessFully")
         }
          
         } catch (err) {
           const msg = err.response?.data?.message || "Failed to submit review";
           alert(msg)
         } 
    }

  return (
    <div className="flex sm:flex-row flex-wrap flex-col gap-3 border-t-2  transition-opacity ease-in duration-500 justify-center mx-auto">

      {isAdded && (
        <div className="  fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center text-xs  ">
          <div className="absolute zoom-once flex-col flex top-[34%] items-center gap-4 bg-white p-4 rounded w-60 py-8">
            <div className="flex item-center gap-3 text-green-800 justify-center">
              {" "}
              Product Added <FaCircleCheck className="size-[16px]" />
            </div>

            <div className="flex gap-4 mt-2">
           
              <button
                className="p-3 w-32 rounded bg-green-100 text-green-600"
                onClick={() => setIsAdded(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="flex-1 p-4">
        <ProductCarousel productData={productData} />
      </div>

      {/* Product info */}
      <div className="productInfo p-4 flex-1">
        <div className="title">
          <h2 className="text-sm text-left font-semibold ">
            {productData.name}
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-[1.2rem] mt-2">
          <p className="font-semibold lg:text-[1.2rem]">₹{displayedPrice}</p>
          <p className="line-through opacity-50 text-xs">
            ₹{productData.mrpPrice}
          </p>
          <p className="text-green-600 font-semibold text-xs">
            {(
              ((productData.mrpPrice - displayedPrice) / productData.mrpPrice) *
              100
            ).toFixed(2)}
            % off
          </p>
        </div>

        {/* Stars */}

        <div className="flex flex-wrap items-center gap-3 mt-3 ">
        <div className="star flex flex-row gap-1 text-sm bg-gray-100 w-fit p-0.5 px-1  rounded flex-wrap items-center">
          {renderStars(productData.rating)}

          {productData.rating && (
            <span className="ml-1 monst font-semibold bg-[var(--secondary)] text-[var(--primary)] flex justify-center items-center p-1 text-[8px] w-4 h-4 rounded-sm">
              {productData.rating}
            </span>
          )}
          
        </div>

         <ShareProduct productName={productData.name} />

        </div>


       

        {/* Size selection */}
        <div className="size mt-4 ">
          <p className="text-xs font-semibold text-left">Select Size</p>
          <div className="selectSize text-xs flex gap-2 mt-2 flex-wrap w-fit flex-row">
            {productData.variants?.map(({ size, stock }, index) => (
              <button
                key={index}
                className={`py-1 px-2.5 font-semibold rounded ${
                  selectedVariant?.size === size && stock !== 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                } ${
                  selectedVariant?.size === size && stock === 0
                    ? "bg-gray-100 border-2 border-gray-400 "
                    : ""
                }`}
                onClick={() => setSelectedVariant(productData.variants[index])}
                style={{
                  cursor: stock === 0 ? "not-allowed" : "pointer",
                  opacity: stock === 0 ? 0.5 : 1,
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="mt-4 mb-6 flex flex-wrap gap-3 max-w-md flex-col md:flex-row mx-auto">


          <button
            className={`p-2 font-semibold rounded flex-1 text-white border border-white shadow-sm ${
              isOutOfStock || isVariantOutOfStock
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
            disabled={!selectedVariant || isVariantOutOfStock}
            onClick={() => handleAddToCart()}
          >
            {isOutOfStock || isVariantOutOfStock
              ? "Out of Stock"
              : !selectedVariant
              ? "Select Size to Add"
              : "Add To Cart"}
          </button>

          <div
            onClick={() => toggleLike(productData._id)}
            className="flex-1 rounded flex justify-center items-center bg-[var(--primary)] shadow-sm z-9 border border-white gap-4  px-4 monst font-semibold p-2"
          > Add To Wishlist
            {likedItems[productData._id] ? (
              <FavoriteIcon
                className={`!text-[16px] text-[var(--secondary)] transition-all duration-200 ${
                  likedItems[productData._id] ? "ping-once" : "animate-none"
                }`}
              />
            ) : (
              <FavoriteBorderIcon className="text-[var(--secondary)] transition-all duration-200 !text-[16px]" />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="description text-left flex flex-col gap-2 mt-4 max-w-[700px] max-h-[200px] overflow-y-scroll px-1">
          <h2 className="text-xs font-semibold">Description</h2>
          <div className="text-xs">{productData.description}</div>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row p-4 ">
        

        <div className="flex-1 flex items-start flex-col  ">
          <h2 className="monst bg-white p-2 ">
            Review <span>{productData.reviews.length}</span>
          </h2>
          <div className="flex flex-col w-full max-w-[550px] gap-2 ">
            
      <ReviewForm productId={productData._id} />
            {productData.reviews?.map((review, index) => (
              <div
                key={review._id}
                className="flex flex-col p-2  mb-2 items-start  poppins !text-[10px] bg-gray-100  text-black w-full relative"
              >
                <p className=" text-black font-semibold">
                  {`${review.userId?.first_name || ""} ${
                    review.userId?.last_name || ""
                  }`.trim()}
                </p>

                <div className="star flex flex-row gap-1 text-sm mt-1 mb-2 bg-gray-200 w-fit p-0.5 px-1  rounded flex-wrap items-center">
                  {renderUserStars(review.rating)}
                  <span className="ml-1 monst font-semibold bg-[var(--secondary)] text-[var(--primary)] flex justify-center items-center p-1 text-[6px] rounded-sm  h-3 w-3">
                    {review.rating}
                  </span>
                </div>

                {review.comment && (
                  <p className=" text-left max-h-[120px] overflow-y-scroll w-full">{review.comment}</p>
                )}

              
{review.userId?._id && String(review.userId._id) === String(currentUserId) && (
  <button
    onClick={() => handleRemoveReview(review._id)}
    className="gap-2 justify-between flex items-center flex-wrap poppins text-[8px] font-semibold mt-2 absolute right-2 top-0  text-gray-700 bg-gray-200 p-1 rounded-full"
  >
    <FaTrash />
  </button>
)}


              </div>
             
            ))}
          </div>
         
        </div>

        <div className="flex-1">
           <ServiceCommitment/>
        </div>



  
      </div>

      

    

<div className="flex justify-center items-center mx-auto w-full">  <RelatedProducts
  currentProductId={productData._id}
  category={productData.category} product={productData}
/></div>

<ShopByCategory/>


    </div>
  );
};

export default ProductDetails;
