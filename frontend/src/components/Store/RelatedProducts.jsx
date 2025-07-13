import ProductCard from './ProductCard'; 
import { useStore } from '../../context/StoreContext';
import Title from '../Title';

const RelatedProducts = ({ currentProductId, category}) => {
  const { products } = useStore();

  if (!products || products.length === 0) return null;




  const related = products
    .filter(
      (product) =>
        product._id !== currentProductId && product.category === category
    )
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="mt-8">
      {/* <h2 className="text-xl font-semibold mb-4 monst">Related Products</h2> */}

      <Title title1="Related" title2='Products'/>
      <div className="flex flex-wrap justify-center items-center">
        {related.map((product) => (
          <ProductCard key={product._id} product={product} basePath="/shop" />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
