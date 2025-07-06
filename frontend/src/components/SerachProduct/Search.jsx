import React, { useEffect, useState } from 'react';
import Store from '../Store/Store';
import { backendUrl } from '../../utils/backendUrl';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../Store/ProductCard';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const navigate=useNavigate();

const [disabled, setDisabled] = useState(false);
const location = useLocation();


 


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
       fetchProduct();
    }
  };


useEffect(() => {
 
  if (query.length < 3) return;

const params = new URLSearchParams(window.location.search);
params.set('search', query.trim());

const newUrl = `${window.location.pathname}?${params.toString()}`;

  const timeoutId = setTimeout(() => {
    fetchProduct();
  }, 400);

  return () => clearTimeout(timeoutId); 
}, [query]);



const fetchProduct = async () => {
   
  
       const response = await axios.get(`${backendUrl}/api/product/search`,{ params: { search: query} })
       console.log(response)
       if(response){
        setResults(response.data.foundProduct)
    

       }
       
    }

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e)=>handleKeyDown(e)}
        disabled={disabled}
        className="border px-4 py-2 w-full"
        placeholder="Search products..."
      />

      <button
        onClick={()=> fetchProduct()}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
        disabled={disabled}
      >
        Search
      </button>


        
              <div className="lg:col-span-3">

 <div className="flex flex-wrap justify-center gap-1 lg:gap-3 mt-6">          {results.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              basePath="/store"
            />
          ))}
        </div>
                
              </div>

       
    </div>
  );
}