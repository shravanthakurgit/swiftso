"use-client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useStore } from "../../context/StoreContext";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { singleFilter } from "../../utils/FilterData";
import CardEffect from "../ShimmerEffect/CardEffect";
import UseNetworkStatus from "../../hooks/useNetworkStatus";
import SearchBar from "../SerachProduct/Search";

const sortOptions = [
  { name: "Relevant", value: "relevant" },
  { name: "Best Rating", value: "best-rating" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "low-high" },
  { name: "Price: High to Low", value: "high-low" },
];

const Store = () => {
  const { products, loading } = useStore();
  const isOnline = UseNetworkStatus();
  const location = useLocation();
  const navigate = useNavigate();

   console.log(loading)

  const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 25;


  const searchParams = new URLSearchParams(location.search);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const handleFilter = (sectionId, value) => {
    setIsFilterApplied(true);
    const searchParams = new URLSearchParams(location.search);

    let filteredValue = searchParams.getAll(sectionId);

    if (
      filteredValue.length > 0 &&
      filteredValue[0].split(",").includes(value)
    ) {
      filteredValue = filteredValue[0]
        .split(",")
        .filter((item) => item !== value);

      if (filteredValue.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filteredValue.push(value);
    }

    if (filteredValue.length > 0) {
      searchParams.set(sectionId, filteredValue.join(","));
    }
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };



  const query = new URLSearchParams(useLocation().search);

  const search = query.get("search")?.split(",") || [];
  const category = query.get("category")?.split(",") || [];
  const subCategory = query.get("subCategory")?.split(",") || [];
  const size = query.get("size")?.split(",") || [];
  const discount = parseInt(query.get("discount"));
  const priceRange = query.get("price")?.split("-") || [];

  let filteredProducts = products || [];

  if (products) {
    filteredProducts = products.filter((product) => {
      const matchCategory =
        !category.length || category.includes(product.category);
      const matchSearch =
        !search.length ||
        search.some((term) =>
          product.name?.toLowerCase().includes(term.toLowerCase())
        );
      const matchSubCategory =
        !subCategory.length || subCategory.includes(product.subCategory);
      const matchSize =
        !size.length ||
        product.variants?.some((variant) => size.includes(variant.size));
      const matchDiscount = !discount || product.discount >= discount;
      const matchPrice =
        priceRange.length !== 2 ||
        (product.price >= Number(priceRange[0]) &&
          product.price <= Number(priceRange[1]));

      return (
        matchCategory &&
        matchSubCategory &&
        matchSize &&
        matchDiscount &&
        matchPrice &&
        matchSearch
      );
    });
  }

  filteredProducts = filteredProducts.filter((product) => {
    const inStockMatch =
      !filters.inStock ||
      filters.inStock.length === 0 ||
      (filters.inStock.includes("inStock") &&
        product.variants?.some((variant) => variant.stock > 0));
    return inStockMatch;
  });

  const [sortOption, setSortOption] = useState("relevant");

  const handleSearch = (inputValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("search", inputValue);
    navigate({ search: `?${searchParams.toString()}` });
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "low-high":
        return a.price - b.price;
      case "high-low":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "best-rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const sortQuery = searchParams.get("sort") || "relevant";
    setSortOption(sortQuery);
  }, [location.search]);

  if (!isOnline || loading) {
    return <CardEffect />;
  }

  if (sortedProducts?.length <= 0) {
    return (
      <p className="monst text-gray-400 font-semibold">No Products Found</p>
    );
  }
 


  const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  return (
    <div className="bg-white mt-8 relative flex justify-center">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-50  "
        >
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
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6 px-2"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 px-3 text-md text-gray-400 hover:text-gray-500">
                            <span className="!font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              ) : (
                                <PlusIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
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
                                      onChange={() =>
                                        handleFilter(section.id, option.value)
                                      }
                                      value={option.value}
                                      checked={searchParams
                                        .getAll(section.id)
                                        .join(",")
                                        .split(",")
                                        .includes(option.value)}
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
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="text-sm text-gray-600"
                                >
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
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6 px-2"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 px-3 text-md text-gray-400 hover:text-gray-500">
                            <span className="!font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              ) : (
                                <PlusIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
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
                                      onChange={() =>
                                        handleFilter(section.id, option.value)
                                      }
                                      value={option.value}
                                      checked={searchParams
                                        .getAll(section.id)
                                        .join(",")
                                        .split(",")
                                        .includes(option.value)}
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
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="text-sm text-gray-600 w-full rounded text-left"
                                >
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

        {location.search.includes("search") && (
          <SearchBar productList={products} setQuery={handleSearch} />
        )}

        <main className="mx-auto mt-16 sm:px-6 lg:px-8 relative">
          <div className="fixed top-28 bg-white w-full z-20  pt-4 -mt-4 border-t border left-0 ">
            <div className="flex  justify-end border-gray-200 pb-3 px-5">
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
                          <button
                            onClick={() => {
                              const params = new URLSearchParams(
                                location.search
                              );
                              params.set("sort", option.value);
                              navigate({ search: `?${params.toString()}` });
                              setSortOption(option.value);
                            }}
                            className={classNames(
                              sortOption === option.value
                                ? "font-semibold text-gray-900"
                                : "text-gray-500",
                              "block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
                            )}
                          >
                            {option.name}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>

                <div className="border border-spacing-x-1 bg-black py-4 "></div>

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
                <div className="flex flex-wrap justify-center gap-1 lg:gap-3 ">
                  {isFilterApplied && (
                    <div className="font-semibold text-left text-slate-400 ml-6 sm:ml-3 mb-2 w-full">
                      <span className=" bg-[var(--secondary)] shadow backdrop-blur-sm rounded text-white p-1 flex w-fit justify-start items-center gap-2 text-sm pr-3 ml-1 sm:ml-4  ">
                        <p className="bg-white text-black rounded-sm h-6 w-fit min-w-6 text-[10px] flex justify-center items-center">
                          {filteredProducts.length}
                        </p>{" "}
                        items
                      </span>
                    </div>
                  )}

                  {loading && (<CardEffect/>)}

                {currentProducts.map((product) => (
  <ProductCard key={product._id} product={product} basePath="/shop" />
))}

                  
                </div>

                



              </div>
            </div>
          </section>

          <div className="flex justify-center my-8 gap-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50  monst text-sm ${currentPage === 1 ? 'hidden':''}`}
  >
    Previous
  </button>

  {[...Array(Math.ceil(sortedProducts.length / productsPerPage)).keys()].map((num) => (
    <button
      key={num + 1}
      onClick={() => setCurrentPage(num + 1)}
      className={`px-3 py-1 rounded ${currentPage === num + 1 ? "bg-black text-white monst" : "bg-gray-100"}`}
    >
      {num + 1}
    </button>
  ))}

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        prev < Math.ceil(sortedProducts.length / productsPerPage) ? prev + 1 : prev
      )
    }
    disabled={currentPage === Math.ceil(sortedProducts.length / productsPerPage)}
    className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 monst text-sm ${currentPage === Math.ceil(sortedProducts.length / productsPerPage) ? 'hidden':''}`}
  >
    Next
  </button>
</div>
        </main>
      </div>
    </div>
  );
};

export default Store;
