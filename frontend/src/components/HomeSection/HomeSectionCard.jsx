import Title from "../Title";
import ProductCard from "../Store/ProductCard";
import { useStore } from "../../context/StoreContext";
import UseNetworkStatus from "../../hooks/useNetworkStatus";
import SingleCardEffect from "../ShimmerEffect/SingleCardEffect";

const HomeSectionCard = ({ title1, title2, Category }) => {
  const isOnline = UseNetworkStatus();
  const { products } = useStore();
  // Ensure case-insensitive comparison for category
  let productsList = products?.filter(
    (product) => product.category.toLowerCase() === Category.toLowerCase()
  );

  if (!isOnline) {
    return (
      <div className="flex flex-col mt-10 px-4">
        <Title title1={title1} title2={title2} />

        <div className="flex flex-wrap justify-center gap-1 ">
          {Array.from({ length: 12 }).map((_, index) => (
            <SingleCardEffect key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10">
      <Title title1={title1} title2={title2} />

      <div className="flex flex-wrap justify-center gap-1">
        {productsList.map((product) => (
          <ProductCard key={product._id} product={product} basePath="/shop" />
        ))}
      </div>
    </div>
  );
};

export default HomeSectionCard;
