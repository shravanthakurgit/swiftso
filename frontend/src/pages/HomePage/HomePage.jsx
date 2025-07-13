import HomeSection from "../../components/HomeSection/HomeSection";
import HeroSection from "../../components/HeroSection/HeroSection";
import ShopByCategory from "../../components/Category/ShopByCategory";

const HomePage = () => {
  return (
    <div className="mx-auto">
      <HeroSection />
      <ShopByCategory />
      <HomeSection title1="Mens'" title2="Wear" Category="men" />
      <HomeSection title1="Womens'" title2="Wear" Category="women" />
      <HomeSection title1="Kids'" title2="Wear" Category="kids" />
    </div>
  );
};

export default HomePage;
