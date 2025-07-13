import { useState, useRef } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

export default function Add({ token }) {
  const [form, setForm] = useState({
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
    variants: [{ size: '', stock: '', price: '' }]
  });

  const [images, setImages] = useState([]);
  const fileInputRefs = useRef([]);


  const [isSubmitting, setIsSubmitting] = useState(false);
const [successMessage, setSuccessMessage] = useState('');


  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm({ ...form, variants: newVariants });
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { size: '', stock: '', price: '' }] });
  };

  const removeVariant = (index) => {
    const newVariants = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: newVariants });
  };

  const handleImageChange = (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);

    if (replaceIndex !== null) {
      const updatedImages = [...images];
      updatedImages[replaceIndex] = files[0];
      setImages(updatedImages);
    } else {
      const newImages = [...images, ...files];
      if (newImages.length > 6) {
        alert('You can upload a maximum of 6 images.');
        return;
      }
      setImages(newImages);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const triggerFileInput = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSuccessMessage('');

  try {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'variants') {
        formData.append('variants', JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    images.forEach((img, index) => {
      formData.append(`image${index + 1}`, img);
    });

    await axios.post(`${backendUrl}/api/product/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setSuccessMessage('✅ Product added successfully!');
   
  } catch (err) {
    console.error(err.response?.data || err);
    alert('❌ Error saving product');
  } finally {
    setIsSubmitting(false);
  }
};


  return (

    <div>
        {successMessage && (
      <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-sm">
        {successMessage}
      </div>
    )}
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4" encType="multipart/form-data">
      {/* Inputs */}
      <input name="name" placeholder="Product Name" value={form.name} onChange={handleInput} className="w-full border p-2" />
      <input name="brand" placeholder="Brand" value={form.brand} onChange={handleInput} className="w-full border p-2" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleInput} className="w-full border p-2" />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleInput} className="w-full border p-2" />
      <input name="mrpPrice" type="number" placeholder="MRP Price" value={form.mrpPrice} onChange={handleInput} className="w-full border p-2" />
      <input name="discount" type="number" placeholder="Discount" value={form.discount} onChange={handleInput} className="w-full border p-2" />

      {/* Image Uploads */}
      <div>
        <p className="text-sm font-semibold">Upload Images (max 6)</p>
        {images.length < 6 && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            className="mb-3"
          />
        )}
        {images.length >= 6 && (
          <p className="text-red-500 text-sm">Maximum of 6 images allowed.</p>
        )}

        <div className="flex flex-wrap gap-3 mt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 border border-gray-300 cursor-pointer group"
              onClick={() => triggerFileInput(idx)}
              title="Click to reselect"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent file input trigger
                  removeImage(idx);
                }}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded opacity-80 group-hover:opacity-100"
              >
                X
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={(el) => (fileInputRefs.current[idx] = el)}
                onChange={(e) => handleImageChange(e, idx)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div>
        <label>Variants</label>
        {form.variants.map((variant, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input value={variant.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} placeholder="Size" className="w-1/4 border p-2" />
            <input type="number" value={variant.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} placeholder="Stock" className="w-1/4 border p-2" />
            <input type="number" value={variant.price} onChange={e => handleVariantChange(i, 'price', e.target.value)} placeholder="Price (optional)" className="w-1/4 border p-2" />
            <button type="button" onClick={() => removeVariant(i)} className="text-red-600">X</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="text-blue-600">+ Add Variant</button>
      </div>

      {/* Category and Sub-category */}
      <select name="category" value={form.category} onChange={handleInput} className="w-full border p-2">
        <option value="">Select Category</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
      </select>

      <select name="subCategory" value={form.subCategory} onChange={handleInput} className="w-full border p-2">
        <option value="">Select Sub-Category</option>
        <option value="topwear">Topwear</option>
        <option value="bottomwear">Bottomwear</option>
        <option value="innerwear">Innerwear</option>
        <option value="winterwear">Winterwear</option>
      </select>

      {/* Checkboxes */}
      <label>
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleInput} /> Featured
      </label>
      <label className="ml-4">
        <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleInput} /> Bestseller
      </label>

     <button
  type="submit"
  className="bg-black text-white px-4 py-2 mt-4"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save Product'}
</button>

    </form>

    </div>
  );
}
