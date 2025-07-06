// CategoryFilter.js
import React, { useState } from 'react'
import { BsFilterLeft } from "react-icons/bs";

const CategoryFilter = ({ onFilterChange }) => {

const categories = ['men', 'women', 'kids'];
  const wearTypes = ['topwear', 'bottomwear', 'innerwear', 'winterwear', 'summerwear'];
  const sizes = ['s', 'm', 'xl', 'xxl', '2xl', '3xl'];
  const colors = ['black', 'blue', 'navyBlue', 'red', 'maroorn', 'white', 'printed', 'graphics', 'doddle'];


  // const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWearTypes, setSelectedWearTypes] = useState([]);
  const[selectedSize, setSelectedSize] = useState([]);
   const [inStock, setInStock] = useState([]);


  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((item) => item !== value);
    setSelectedCategories(updated);
    onFilterChange({ categories: updated, wearTypes: selectedWearTypes, inStock});
  };

  const handleWearTypeChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...selectedWearTypes, value]
      : selectedWearTypes.filter((item) => item !== value);
    setSelectedWearTypes(updated);
    onFilterChange({ categories: selectedCategories, wearTypes: updated, inStock});
  };

  const handleStock = (e) => {
  const { checked } = e.target;
  const updated = checked ? ['inStock'] : [];
  setInStock(updated);
  onFilterChange({
    categories: selectedCategories,
    wearTypes: selectedWearTypes,
    inStock: updated,
  });
};

  return (
    <div className='mb-5 w-[100%] flex  flex-col sm:flex-row'>





      <div className=" w-full flex flex-wrap flex-row justify-between md:justify-evenly gap-2 items-start">
      





      <div className="sm:block bg-[var(--primary)] rounded flex-1 ">
        <h3 className="mb-2">Categories</h3>
        <div className="flex flex-col text-left">

<div class="relative flex flex-col rounded-b-sm bg-white shadow h-full">
   <nav class="flex flex-col gap-1 p-2">
 {categories.map((slug_name, index) => (
  <div
    key={slug_name}
    role="button"
    className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
  >
    <label
      htmlFor={slug_name}
      className="flex w-full cursor-pointer items-center px-3 py-2"
    >
      <div className="inline-flex items-center">
        <label className="flex items-center cursor-pointer relative" htmlFor={slug_name}>
          <input
            type="checkbox"
            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
            id={slug_name}
            value={slug_name}
            onChange={handleCategoryChange}
          />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" strokeWidth="1">
              <path fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"></path>
            </svg>
          </span>
        </label>
      <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor={slug_name}>
  {slug_name[0].toUpperCase() + slug_name.slice(1)}
</label>

      </div>
    </label>
  </div>
))}

</nav>

</div>


        </div>
      </div>







<div className="sm:block bg-[var(--primary)] rounded flex-1 max-h-[150px] overflow-y-scroll">
        <h3 className="mb-2">WearType</h3>
        <div className="flex flex-col text-left">

<div class="relative flex flex-col rounded-b-sm bg-white shadow h-full">
   <nav class="flex flex-col gap-1 p-2">
 {wearTypes.map((slug_name, index) => (
  <div
    key={slug_name}
    role="button"
    className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
  >
    <label
      htmlFor={slug_name}
      className="flex w-full cursor-pointer items-center px-3 py-2"
    >
      <div className="inline-flex items-center">
        <label className="flex items-center cursor-pointer relative" htmlFor={slug_name}>
          <input
            type="checkbox"
            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
            id={slug_name}
            value={slug_name}
            onChange={handleWearTypeChange}
          />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
              stroke="currentColor" strokeWidth="1">
              <path fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"></path>
            </svg>
          </span>
        </label>
      <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor={slug_name}>
  {slug_name[0].toUpperCase() + slug_name.slice(1)}
</label>

      </div>
    </label>
  </div>
))}

</nav>

</div>


        </div>
      </div>






      </div>




       <div
      role="button"
      class="flex items-start justify-center "
    >
      <label
        for="InStock"
        class="flex w-full cursor-pointer px-3 py-2 transition-all duration-75 hover:bg-slate-600 focus:bg-slate-100 active:bg-slate-100 rounded-lg bg-[var(--secondary)] ml-4 mt-1 "
       onChange={handleStock}>
        <div class="inline-flex items-center hover:text-slate-400">
          <label class="flex items-center cursor-pointer relative " for="InStock">
            <input type="checkbox"
              class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-white checked:bg-slate-800 checked:border-slate-800 hover:border-slate-400"
              id="InStock"/>
            <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" stroke-width="1">
                <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
              </svg>
            </span>
          </label>
          <label class="cursor-pointer ml-2 text-sm text-white " for="InStock">
            InStock
          </label>
        </div>
      </label>
    </div>



 
     

    </div>
  )
}

export default CategoryFilter;
