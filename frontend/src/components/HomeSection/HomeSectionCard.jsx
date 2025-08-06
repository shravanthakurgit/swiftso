import { Link } from 'react-router-dom';
import Title from "../Title";
import ProductCard from "../Store/ProductCard";
import { useStore } from "../../context/StoreContext";
import UseNetworkStatus from "../../hooks/useNetworkStatus";
import SingleCardEffect from "../ShimmerEffect/SingleCardEffect";
import { FastForward } from 'lucide-react';

const HomeSectionCard = ({ title1, title2, Category }) => {
  const isOnline = UseNetworkStatus();
  const { products, loading } = useStore();

  const productsList = products?.filter(
    (product) => product.category.toLowerCase() === Category.toLowerCase()
  ) || [];

const limitedProducts = productsList
  .sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date || a._id);
    const dateB = new Date(b.createdAt || b.date || b._id);
    return dateB - dateA; 
  })
  .slice(0, 12);


  if (loading) {
    return (
      <div className="flex flex-col mt-10">
        <Title title1={title1} title2={title2} />

        <div className="flex flex-wrap justify-center gap-1">
          {Array.from({ length: 12 }).map((_, index) => (
            <SingleCardEffect key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10 items-center">
      <Title title1={title1} title2={title2} />

      <div className="flex flex-wrap justify-center gap-1">
        {limitedProducts.map((product) => (
          <ProductCard key={product._id} product={product} basePath="/shop" />
        ))}
      </div>

      {productsList.length > 0 && (
        <Link
          to="/shop"
          className="mt-4 px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-black hover:text-white transition duration-300 monst flex gap-2 items-center linkc"
        >
          Shop All Products <FastForward size={16}/>
        </Link>
      )}
    </div>
  );
};

export default HomeSectionCard;
