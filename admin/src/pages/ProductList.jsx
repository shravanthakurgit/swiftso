import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
// import { token } from '../utils/token';


const ProductList = ({token}) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  
  const getTotalStock = (product) =>
    product.variants?.reduce((acc, variant) => acc + (variant.stock || 0), 0) || 0;

  const fetchProducts = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/list`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success("Item removed successfully");
        fetchProducts();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.message ||"Faled To Reomve");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || a._id);
      const dateB = new Date(b.createdAt || b.date || b._id);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const overallStock = filteredProducts.reduce((acc, p) => acc + getTotalStock(p), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">All Products</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 px-3 py-2 border rounded-md text-sm shadow-sm"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border rounded-md text-sm shadow-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="mb-6 text-right text-sm font-medium text-green-600">
        Total Stock (All Products): <span className="font-bold">{overallStock}</span>
      </div>

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map(product => {
            const totalStock = getTotalStock(product);
            return (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="w-full sm:w-24 h-24 flex justify-center items-center border bg-gray-50">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-medium text-gray-800 truncate">{product.name}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <div className="flex flex-wrap gap-2">
                      {product.variants?.map((v, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 border rounded text-xs">
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Total stock: {totalStock}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => navigate(`/update/?id=${product._id}`, {
                      state: { product }
                    })}
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => removeProduct(product._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;
