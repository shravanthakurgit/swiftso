
'use-client'

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import CategoryFilter from "./Category/CategoryFilter";
import { useStore } from "../../context/StoreContext";
import useFilters from "../../hooks/useFilters";
import { useLocation, useNavigate } from "react-router-dom";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { filters } from "../../utils/FilterData";


import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'

import { singleFilter } from "../../utils/FilterData";
import CardEffect from "../ShimmerEffect/CardEffect";
import UseNetworkStatus from "../../hooks/useNetworkStatus";



const sortOptions = [


  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

const Store = () => {
  const { products, loading, error } = useStore();
const isOnline  = UseNetworkStatus()
  const location = useLocation();
  const navigate = useNavigate();

const searchParams = new URLSearchParams(location.search);

const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const [isFilterApplied, setIsFilterApplied] =useState(false)

  const handleFilter = (sectionId,value)=>{
      setIsFilterApplied(true);
  const searchParams = new URLSearchParams(location.search)

  let filteredValue = searchParams.getAll(sectionId)

if(filteredValue.length > 0 && filteredValue[0].split(",").includes(value)){

  filteredValue= filteredValue[0].split(",").filter((item)=> item !==value);

  if(filteredValue.length===0){
searchParams.delete(sectionId)
  }
}

else{
  filteredValue.push(value)
}

if(filteredValue.length > 0){
  searchParams.set(sectionId,filteredValue.join(","))

}
 const query = searchParams.toString();
  navigate({search:`?${query}`})

  }


  const handleSingleFilter = (sectionId,e) =>{

      setIsFilterApplied(true);
const searchParams = new URLSearchParams(location.search)

searchParams.set(sectionId,e.target.value)
const query = searchParams.toString();
  navigate({search:`?${query}`})
  }


const query = new URLSearchParams(useLocation().search);

const search = query.get('search')?.split(',') || [];
const category = query.get('category')?.split(',') || [];
const subCategory = query.get('subCategory')?.split(',') || [];
const size = query.get('size')?.split(',') || [];
const discount = parseInt(query.get('discount'));
const priceRange = query.get('price')?.split('-') || [];


let filteredProducts = products || [];

// Apply filters only if products exist
if (products) {
  filteredProducts = products.filter((product) => {
    const matchCategory = !category.length || category.includes(product.category);
    const matchSearch = !search.length || 
      search.some(term => product.name?.toLowerCase().includes(term.toLowerCase()));
    const matchSubCategory = !subCategory.length || subCategory.includes(product.subCategory);
    const matchSize = !size.length || 
      product.variants?.some((variant) => size.includes(variant.size));
    const matchDiscount = !discount || product.discount >= discount;
    const matchPrice = priceRange.length !== 2 || 
      (product.price >= Number(priceRange[0]) && product.price <= Number(priceRange[1]));

    return matchCategory && matchSubCategory && matchSize && matchDiscount && matchPrice && matchSearch;
  });
}

// Then apply the inStock filter
filteredProducts = filteredProducts.filter(product => {
  const inStockMatch = !filters.inStock || filters.inStock.length === 0 ||
    (filters.inStock.includes("inStock") && 
     product.variants?.some(variant => variant.stock > 0)); // Changed from filteredProducts.variants to product.variants
  return inStockMatch;
});


    const [sortOption, setSortOption] = useState('relevant');

 

    const handleSortChange = (e) => {
      setSortOption(e.target.value);
    };


  //   // Sort filtered products
   const sortedProducts = [...filteredProducts].sort((a, b) => {
  const priceA = parseFloat(a.price);
  const priceB = parseFloat(b.price);

  switch (sortOption) {
    case 'low-high':
      return priceA - priceB;
    case 'high-low':
      return priceB - priceA;
    case 'newest':
      return new Date(b.createdAt) - new Date(a.createdAt);
    case 'best-rating':
      return b.rating - a.rating;
    default: // 'relevant' or default case
      return 0;
  }
});

    // filteredProducts.category.length > 0 ||
    // filteredProducts.subCategory.length > 0
    // (filteredProducts.inStock && filters.inStock.length > 0) ||
    // sortOption !== 'relevant';

 if (!isOnline) {
  return <CardEffect />;
}

  return (
//     <div className="flex flex-col justify-center items-center -mt-10">
// {/* 
//       <div className="flex justify-between w-full fixed top-[100px] z-40 bg-white p-3 px-0  text-xs sm:text-sm border-b-2 border-slate-400]">
//         <div className=" cursor-pointer relative w-1/2  text-center flex justify-center border-r-[2px] border-slate-200">
//           <button className="bg-transparent px-4 appearance-none z-10 flex items-center  poppins w-full">
//             <label
//               class="hamburger w-full  flex items-center justify-center gap-4"
//               htmlFor="filterCheck"
//             >
//               Filter
//               <input
//                 type="checkbox"
//                 id="filterCheck"
//                 checked={showFilter}
//                 onChange={showCategoryFilter}
//               />
//               <svg viewBox="0 0 32 32">
//                 <path
//                   class="line line-top-bottom"
//                   d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
//                 ></path>
//                 <path class="line" d="M7 16 27 16"></path>
//               </svg>
//             </label>
//           </button>
//         </div>

//         <div className="cursor-pointer relative w-1/2 pl-1  poppins ">
//           <select
//             value={sortOption}
//             onChange={handleSortChange}
//             className="bg-transparent text-center appearance-none transition-all duration-150"
//           >
//             <option value="relevant" className="">
//               Sort By : Relevant
//             </option>
//             <option value="low-high">Price : Low to High </option>
//             <option value="high-low">Price : High to Low</option>
//           </select>
//         </div>
//       </div> */}

//       <div className="flex flex-col justify-center w-full items-center mt-16">
//         {/* <div
//           className={`w-full px-8 transition-all duration-300 ease-in-out transform ${
//             showFilter
//               ? "translate-y-0 opacity-100 max-h-[500px] mt-4"
//               : "-translate-y-10 opacity-0 max-h-0 overflow-hidden"
//           }`}
//         >
//           <CategoryFilter onFilterChange={handleFilterChange} />
//         </div> */}

//         {/* <p className="text-lg font-poppins font-bold">
//             <span className='text-blue-600'>Our </span>Collections 
//           </p> */}

      

        

//         <div className="flex flex-wrap justify-center gap-1 lg:gap-3 mt-6">
//           {products.map((product) => (
//             <ProductCard
//               key={product._id}
//               product={product}
//               basePath="/store"
//             />
//           ))}
//         </div>


//       </div>
//     </div>



<div className="bg-white mt-8 relative flex justify-center">

    { isFilterApplied &&  <div className="font-semibold text-left text-slate-400 ml-6 p-4 -mb-6 w-full absolute top-2 right-2">
            <span className=" bg-[var(--secondary)] shadow backdrop-blur-sm rounded text-white p-1 flex w-fit justify-start items-center gap-2 text-sm pr-3 ml-1 sm:ml-4  ">
              <p className="bg-white text-black rounded-sm h-6 w-fit min-w-6 text-[10px] flex justify-center items-center">
                {filteredProducts.length}
              </p>{" "}
              items
            </span>
         
         
          </div>

        

        }

      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-50  ">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden "
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                

               {filters.map((section) => (


                
<Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6 px-2">
  {({ open }) => (
    <>
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 px-3 text-md text-gray-400 hover:text-gray-500">
          <span className="!font-medium text-gray-900">{section.name}</span>
          <span className="ml-6 flex items-center">
            {open ? (
              <MinusIcon aria-hidden="true" className="size-5" />
            ) : (
              <PlusIcon aria-hidden="true" className="size-5" />
            )}
          </span>
        </DisclosureButton>
      </h3>

      <DisclosurePanel className="pt-6">
        <div className="space-y-4 px-3">
          {section.options.map((option, optionIdx) => (
            <div key={option.value} className="flex gap-3">
              <div className="flex h-5 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
  onChange={() => handleFilter(section.id, option.value)}
  value={option.value}
  checked={searchParams.getAll(section.id).join(',').split(',').includes(option.value)}
  id={`filter-${section.id}-${optionIdx}`}
  name={`${section.id}[]`}
  type="checkbox"
  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
/>
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </>
  )}
</Disclosure>

                ))}



              {singleFilter.map((section) => (


                
<Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6 px-2">
  {({ open }) => (
    <>
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 px-3 text-md text-gray-400 hover:text-gray-500">
          <span className="!font-medium text-gray-900">{section.name}</span>
          <span className="ml-6 flex items-center">
            {open ? (
              <MinusIcon aria-hidden="true" className="size-5" />
            ) : (
              <PlusIcon aria-hidden="true" className="size-5" />
            )}
          </span>
        </DisclosureButton>
      </h3>

      <DisclosurePanel className="pt-6">
        <div className="space-y-4 px-3">
          {section.options.map((option, optionIdx) => (
            <div key={option.value} className="flex gap-3">
              <div className="flex h-5 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                 <input
  onChange={() => handleFilter(section.id, option.value)}
  value={option.value}
  checked={searchParams.getAll(section.id).join(',').split(',').includes(option.value)}
  id={`filter-${section.id}-${optionIdx}`}
  name={`${section.id}[]`}
  type="checkbox"
  className="col-start-1 row-start-1 appearance-none rounded-full border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
/>
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600 w-full rounded text-left">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </DisclosurePanel>
    </>
  )}
</Disclosure>

                ))}
    



              </form>

            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto mt-16 sm:px-6 lg:px-8 relative">


<div className="fixed top-28 bg-white w-full z-20  pt-4 -mt-4 border-t border left-0 ">

          <div className="flex  justify-end border-gray-200 pb-3 px-5">

            {/* <h1 className=" text-2xl font-bold tracking-tight text-gray-900 monst">Trending Collections</h1> */}

            <div className="flex items-center  w-full justify-between flex-row-reverse lg:justify-around px-2 ">

              <Menu as="div" className="relative text-right">
                <div>
                  <MenuButton className="group inline-flex justify-center text-md font-medium text-gray-600 hover:text-gray-900 gap-3 items-center poppins text-[14px]">
                    Sort
                    <Squares2X2Icon aria-hidden="true" className="size-4" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1 ">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>


              <div className="border border-spacing-x-1 bg-black py-4 "></div>

              {/* <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                
              </button> */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-2 p-2 text-gray-600 hover:text-gray-500 sm:ml-6  flex flex-row-reverse flex-wrap gap-2 items-center justify-start poppins text-[14px]"
              >
                <span className="">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

   </div>

          <section aria-labelledby="products-heading" className="">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className=" flex justify-between gap-10 ">
              {/* Filters */}

             

              {/* Product grid */}

              <div className="flex -mt-10">

 <div className="flex flex-wrap justify-center gap-1 lg:gap-3 ">          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              basePath="/store"
            />
          ))}
        </div>
                
              </div>


            </div>
          </section>

     

        </main>
      </div>
    </div>



  )
};

export default Store;
