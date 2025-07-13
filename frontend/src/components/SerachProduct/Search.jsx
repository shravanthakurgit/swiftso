import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ productList = [], setQuery }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) {
      setSuggestions([]);
      return;
    }

    const searchWords = trimmedInput.split(/\s+/);

    const filtered = productList.filter((product) => {
      const name = product.name.toLowerCase();
      const category = product.category?.toLowerCase() || '';
      
      return searchWords.every(
        (word) => name.includes(word) || category.includes(word)
      );
    });

    setSuggestions(filtered.slice(0, 5)); 
  }, [input, productList]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion) => {
    setInput(suggestion.name);
    setShowDropdown(false);
    setQuery(suggestion.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(input);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-8 px-6 text-sm">
      <form onSubmit={handleSubmit} className='flex mx-auto py-4 gap-3'>
        <input
          type="text"
          className="w-full bg-gray-100 border px-4 py-2 rounded-full  focus:outline-none "
          placeholder="Search by name or category..."
          value={input}
          onChange={(e) => {
      setInput(e.target.value);
      setShowDropdown(true);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        handleSubmit(e);
      }
    }}
    
        />

  

        <button type="submit" className="bg-gray-200 px-6  text-gray-600 rounded-full"> <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-4"
                    /></button>

      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="font-medium">{item.name}</span>{' '}
              <span className="text-sm text-gray-500">({item.category})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
