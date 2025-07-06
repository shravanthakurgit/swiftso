import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { backendUrl } from '../App';
import { FaRegCircleCheck } from "react-icons/fa6";


const EditProduct = () => {

     const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const productId = queryParams.get('id');


const [isLoading, setIsLoading] = useState(false);
const [isUpdated, setIsUpdated] = useState(false);


 

  

  const [formData, setFormData] = useState({
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
    images: Array(6).fill(null),
    previews: Array(6).fill(null),
    files: Array(6).fill(null),
  });

  useEffect(() => {
  if (!productId){
    alert("no product Id found")
  };
  

  axios.get(`${backendUrl}/api/product/single`, {
    params: { productId }
  })
    .then(res => {
      const product = res.data.product;
      setFormData(prev => ({
        ...prev,
        ...product,
        previews: product.images || [],
        variants: product.variants || [],
      }));
    })
    .catch(err => console.error(err));
}, [productId]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', stock: 0, price: 0 }]
    }));
  };

  const handleImageChange = (index, file) => {
    const newFiles = [...formData.files];
    const newPreviews = [...formData.previews];
    newFiles[index] = file;
    newPreviews[index] = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      files: newFiles,
      previews: newPreviews
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); // start loading

  const body = new FormData();
  body.append('id', productId);

  Object.entries(formData).forEach(([key, value]) => {
    if (['files', 'previews', 'images', 'variants'].includes(key)) return;
    body.append(key, value);
  });

  formData.files.forEach((file, index) => {
    if (file) {
      body.append(`image${index + 1}`, file);
    }
  });

  body.append('variants', JSON.stringify(formData.variants));

  try {
    const res = await axios.put(`${backendUrl}/api/product/update`, body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // alert(res.data.message || 'Product updated!');
  } catch (err) {
    alert(err.response?.data?.message || 'Error updating product');
  } finally {
    setIsLoading(false);
    setIsUpdated(true); // stop loading
  }
};


  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg mt-8">

            {isLoading && (
  <div className=" fixed text-center text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
    <div className="absolute flex justify-center items-center gap-4">Updating product... Please wait. <AiOutlineLoading3Quarters className='animate-spin' /></div>
  </div>
)}

    {isUpdated && (
  <div className=" fixed text-center m-auto text-white font-semibold inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center ">
    <div className="absolute  flex justify-center items-center gap-4">Product Updated <FaRegCircleCheck /></div>
    <button onClick={()=>setIsUpdated(false)} className='absolute top-[60%] p-3 border px-4 w-[250px]'>Close</button>

  </div>
)}



      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        {['name', 'brand', 'description', 'price', 'mrpPrice', 'discount', 'category', 'subCategory'].map(field => (
          <input
            key={field}
            name={field}
            value={formData[field] || ''}
            onChange={handleInputChange}
            placeholder={field}
            className="w-full p-2 border rounded"
          />
        ))}

        {/* Featured & Bestseller */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={formData.bestseller}
              onChange={handleInputChange}
            />
            Bestseller
          </label>
        </div>

        {/* Images */}
        <div className="grid grid-cols-3 gap-4">
          {formData.previews.map((img, i) => (
            <div key={i} className="flex flex-col items-center">
              {img && <img src={img} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(i, e.target.files[0])}
                className="mt-1"
              />
            </div>
          ))}
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Variants</h3>
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={variant.size}
                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                placeholder="Size"
                className="p-2 border rounded w-1/3"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                placeholder="Stock"
                className="p-2 border rounded w-1/3"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                placeholder="Price"
                className="p-2 border rounded w-1/3"
              />
            </div>
          ))}
          <button type="button" onClick={addVariant} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Add Variant
          </button>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading} className="w-full mt-4 bg-green-600 text-white p-3 rounded">
          Update Product
        </button>
      </form>

  
    </div>
  );
};

export default EditProduct;
