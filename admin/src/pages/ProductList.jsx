import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { Link } from 'react-router-dom';

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const filteredProducts = products
  .filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date || a._id); // fallback if createdAt doesn't exist
    const dateB = new Date(b.createdAt || b.date || b._id);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });


 

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        console.log("Fetched products:", response);
        setProducts(response.data.products || response.data || []);
        console.log(products)
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    const removeProduct = async (id)=>{
try{
 const response = await axios.post(backendUrl+'/api/product/remove',{id},{headers:{token}})
 if (response.data.success){
  toast.success("Item removed Successfully")
  await  fetchProducts();
 }
 else{
  toast.error("Error removing product")
 }
}
catch (error) {
console.log(error)
}
    }

  useEffect(()=>{
    fetchProducts();
  },[])
  

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Products</h1>

      <div className="flex justify-between items-center px-6 mb-4">
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-2 py-1 text-sm rounded-sm w-[60%]"
  />
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="border px-2 py-1 text-sm rounded-sm"
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>


      <div className="flex justify-between px-6 mb-3">
        <p className="text-sm ml-4 font-semibold">Image</p>
        <p className="text-sm font-semibold">Name</p>
        <p className="text-sm font-semibold mr-4">Quantity</p>
      </div>
      <div className="space-y-2 px-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <div key={product.id} className="p-2 border rounded flex justify-between items-center gap-2 px-3 relative">

            <div className="w-[70px] h-[90px] border flex justify-center items-center p-1">
              <img src={product.images[0]} className="object-contain h-[80px]" alt={product.name}/>
              </div>
              <p className="text-xs text-ellipsis  max-w-[50%]">{product.name}</p>
              <p className="text-xs">{product.quantity}</p>
              <button className=" absolute -right-6 rounded-sm top-[5%] bg-black text-white p-1" onClick={()=>removeProduct(product._id)}><FaTrashAlt /></button>

              <Link to={`/update/?id=${product._id}`}>
              
              <button className=" absolute -right-6 rounded-sm top-[20%] bg-black text-white p-1"><FiEdit3 /></button> 
              </Link>
             
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
