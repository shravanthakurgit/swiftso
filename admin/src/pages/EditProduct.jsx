import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';
import { backendUrl } from '../App';

const CATEGORIES = ['men', 'women', 'kids'];
const SUBCATEGORIES = ['topwear', 'bottomwear', 'innerwear', 'winterwear'];

const EditProduct = ({token}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('id');
  const { product } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [previews, setPreviews] = useState(Array(6).fill(null));
  const [currentImages, setCurrentImages] = useState(Array(6).fill(null));

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      price: '',
      mrpPrice: '',
      discount: '',
      category: '',
      subCategory: '',
      featured: false,
      bestseller: false,
      variants: [],
      files: Array(6).fill(null)
    }
  });

  const { fields: variantFields, append: addVariant } = useFieldArray({
    control,
    name: 'variants'
  });

  useEffect(() => {
    if (!productId) return;

    if (product) {
      for (const [key, value] of Object.entries(product)) {
        if (key === 'variants') {
          value.forEach(v => addVariant(v));
        } else if (key === 'images') {
          const filledImages = [...Array(6)].map((_, i) => value[i] || null);
          setCurrentImages(filledImages);
        } else {
          setValue(key, value);
        }
      }
    }
  }, [productId, product, setValue, addVariant]);

  const handleImageChange = (index, file) => {
    const updatedFiles = getValues("files");
    updatedFiles[index] = file;
    setValue("files", updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviews(updatedPreviews);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('id', productId);

    for (const [key, value] of Object.entries(data)) {
      if (key === 'files' || key === 'variants') continue;
      formData.append(key, value);
    }

    data.files.forEach((file, i) => {
      if (file) {
        formData.append(`image${i + 1}`, file);
      }
    });

    formData.append('variants', JSON.stringify(data.variants));

    try {
      await axios.put(`${backendUrl}/api/product/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsUpdated(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Product Name</label>
            <input {...register("name")} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Brand</label>
            <input {...register("brand")} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Price</label>
            <input type="number" {...register("price")} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">MRP</label>
            <input type="number" {...register("mrpPrice")} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Discount (%)</label>
            <input type="number" {...register("discount")} className="input w-full" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <select {...register("category")} className="input w-full">
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Subcategory</label>
            <select {...register("subCategory")} className="input w-full">
              <option value="">Select Subcategory</option>
              {SUBCATEGORIES.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea {...register("description")} rows="4" className="input w-full" />
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("featured")} />
            <span>Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("bestseller")} />
            <span>Bestseller</span>
          </label>
        </div>

        {/* Variants */}
        <div>
          <h3 className="text-lg font-semibold">Variants</h3>
          {variantFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block mb-1 text-sm font-medium">Size</label>
                <input {...register(`variants.${index}.size`)} className="input w-full" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Stock</label>
                <input type="number" {...register(`variants.${index}.stock`)} className="input w-full" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Price (optional)</label>
                <input type="number" {...register(`variants.${index}.price`)} className="input w-full" />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addVariant({ size: '', stock: 0, price: 0 })}
            className="mt-3 text-blue-600 hover:underline"
          >
            + Add Variant
          </button>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border p-2 rounded shadow-sm">
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  {previews[i] ? (
                    <img src={previews[i]} alt={`New Preview ${i + 1}`} className="h-full object-contain" />
                  ) : currentImages[i] ? (
                    <img src={currentImages[i]} alt={`Current ${i + 1}`} className="h-full object-contain" />
                  ) : (
                    <span className="text-sm text-gray-400">No image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(i, e.target.files[0])}
                  className="mt-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center text-white">
          <div className="flex items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" /> Updating...
          </div>
        </div>
      )}

      {/* Success Message */}
      {isUpdated && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col justify-center items-center text-white">
          <div className="flex items-center gap-2 text-lg">
            Product Updated <FaRegCircleCheck />
          </div>
          <button onClick={() => setIsUpdated(false)} className="mt-4 border px-6 py-2">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
