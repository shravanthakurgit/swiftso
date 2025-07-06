import { useSearchParams } from 'react-router-dom';

const useFilters = () => {
  const [searchParams] = useSearchParams();

  const categories = searchParams.getAll('category');
  const wearTypes = searchParams.getAll('subCategory');
  const inStock = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') || 'relevant';
  const sizes = searchParams.getAll('size');
const colors = searchParams.getAll('color');

return {
  filters: { categories, wearTypes, inStock, sizes, colors },
  sortOption: sort
};
};

export default useFilters;
