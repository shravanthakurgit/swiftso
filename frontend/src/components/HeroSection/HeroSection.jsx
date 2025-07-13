import { Link } from 'react-router-dom';
import { BsShopWindow } from "react-icons/bs";
import Category from '../../utils/Category';
import Title from '../Title';

export default function HeroSection() {
  return (
    <>
      {/* Top Hero Banner */}
      <section className="relative mb-6 bg-white overflow-hidden  hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 
">
          <h1 className="text-lg md:text-3xl font-bold text-[#976666] text-left max-w-[150px] md:max-w-[250px] monst">
            <span className="text-[#311d1d]">DISCOVER</span> THE LATEST <span className="text-[#311d1d]">TREND</span>
          </h1>
        </div>
      </section>

      {/* Second Section: Category + Text + Image */}
      <section className="flex flex-col-reverse lg:flex-row-reverse items-center gap-6 bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        {/* Left: Category block */}
        <div className="flex-1 w-full space-y-2 border-t-2 border-white md:border-none">
          <Title title1="Looking For" title2="?" />
          <Category />
        </div>

        {/* Right: Text + Image */}
        <div className="flex flex-col md:flex-row items-start gap-6 flex-1 w-full">
          {/* Text Content */}
          <div className="flex-1 space-y-4">
            <span className="text-sm uppercase tracking-widest text-gray-500 font-semibold">New Collection</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Style That Speaks For You
            </h2>
            <p className="text-gray-600 max-w-md">
              Discover minimalist fashion essentials crafted with premium materials and timeless design.
            </p>
            <div className="flex gap-4">
              <Link to="/shop">
                <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 text-sm font-semibold flex items-center gap-2">
                  Explore Store <BsShopWindow />
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block max-w-[200px] md:max-w-[250px] flex-shrink-0">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg"
              alt="Hero"
              className="w-full h-auto rounded shadow"
            />
          </div>
        </div>
      </section>
    </>
  );
}
