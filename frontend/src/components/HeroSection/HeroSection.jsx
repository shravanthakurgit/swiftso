import { Link, NavLink } from 'react-router-dom';
import { BsShopWindow } from "react-icons/bs";


export default function HeroSection() {
    return (

      <>


       {/* <!-- Hero Section --> */}

    <section className="hero-section relative mb-6">
      <div className="container mx-auto py-24 md:py-32 w-full ">
        <div className="">


          <h1 className="text-md md:text-2xl font-bold text-[#976666] mb-4 text-left absolute left-0 px-10 p-4  sm:top-[25%] font-w tracking-wider monst max-w-[100px] sm:max-w-[350px] top-[20%]">
            <span className=' text-[#311d1d] '>DISCOVER</span> THE LATEST <span className=' text-[#311d1d] '>TREND</span> 
          </h1>
          
          {/* <p class="text-lg text-white mb-8 bg-black bg-opacity-30">
            Discover our latest arrivals designed for comfort and style. Premium
            quality that lasts.
          </p> */}
          {/* <div class="flex flex-wrap gap-4">
            <NavLink to='/store' 
              class="py-3 px-6 bg-primary text-white font-medium rounded-button hover:bg-primary/90 transition-colors whitespace-nowrap"
              >Shop Now</NavLink>
            <a
              href="#"
              class="py-3 px-6 bg-white text-gray-800 font-medium rounded-button border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >Explore Collection</a
            >
          </div> */}
        </div>
      </div>
    </section>

      


      <section className="bg-white flex px-5 py-4 mt-6">
        <div className="max-w-7xl mx-auto flex gap-3 items-start monst ">
          {/* Text Content */}
          <div className="space-y-4 flex-1 flex flex-start flex-col justify-start items-start">
            <span className="text-sm uppercase tracking-widest text-gray-500 block pt-5 font-semibold">New Collection</span>
            <h1 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900">
              Style That Speaks For You
            </h1>
            <p className="text-gray-600  text-left max-w-[450px]">
              Discover minimalist fashion essentials crafted with premium materials and timeless design.
            </p>
            <div className="flex flex-row gap-4 justify-start items-start  mx-auto w-full">
            <Link to="/store">
              <button className="bg-black text-white px-10 py-3 rounded hover:bg-gray-800 text-sm flex font-semibold gap-4 items-center w-fit my-5">Explore Store 
              <BsShopWindow />
              </button>

              </Link>

              {/* <button className="border border-gray-300 px-6 py-3 rounded-2xl text-gray-700 hover:bg-gray-100 transition transition-all duration-200 hover:shadow-lg">
                Explore Lookbook
              </button> */}
              
            
            </div>
          </div>
  
          {/* Hero Image */}
          <div className="max-w-[200px] md:max-w-[250px] mx-auto hidden md:flex flex-1 items-start">
            <img
              src="https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg"
              alt="Model in stylish clothing"
              className="w-full h-auto rounded lg:mt-7"
            />

            
          </div>
        </div>
      </section>


      
      </>
    );
  }
  