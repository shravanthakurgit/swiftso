import { useState, useEffect } from 'react';
import ProductCard from '../Store/ProductCard';
import Title from '../Title';
import { useStore } from '../../context/StoreContext';
import Error from '../../utils/Error';
import UseNetworkStatus from '../../hooks/useNetworkStatus';
import SingleCardEffect from '../ShimmerEffect/SingleCardEffect';

const LikedItems = () => {
  const { products, loading } = useStore();
  const [likedProducts, setLikedProducts] = useState([]);
const isOnline = UseNetworkStatus ();
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("likedItems")) || {};
    const likedProductIds = Object.keys(liked).filter(key => liked[key] === true);

    const filteredProducts = products?.filter(product =>
      likedProductIds.includes(product._id?.toString())
    );
    setLikedProducts(filteredProducts);
  }, [products]); 

  if (!isOnline) return <div className="flex flex-col my-5">
      <Title title1={'Liked'} title2={'Products'} />
      <div className="flex flex-wrap justify-center gap-1 lg:gap-3 my-5"> 
        {Array.from({ length: 6 }).map((_, index) => (
  <SingleCardEffect key={index} />
))}
        {likedProducts.map(product => (
          <ProductCard key={product._id} product={product} basePath="/liked" />
        ))}
      </div>
    </div>
  


  return likedProducts?.length > 0 ? (
    <div className="flex flex-col my-5">
      <Title title1={'Liked'} title2={'Products'} />
      <div className="flex flex-wrap justify-center gap-1 lg:gap-3 my-5"> 
        {!isOnline && Array.from({ length: 6 }).map((_, index) => (
  <SingleCardEffect key={index} />
))}
        {likedProducts?.map(product => (
          <ProductCard key={product._id} product={product} basePath="/liked" />
        ))}
      </div>
    </div>
  ) : ( loading && likedProducts?.length===0 ?
   (<Error message='Something Went Wrong'/>) : (<Error message="No Items In Your Wishlist"/>)
  );
};

export default LikedItems;
