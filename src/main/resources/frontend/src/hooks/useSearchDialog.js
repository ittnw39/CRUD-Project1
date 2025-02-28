import { useCallback } from 'react';
import useCosmeticStore from '../store/cosmeticStore';
import useSearch from './useSearch';

const useSearchDialog = () => {
  const { cosmetics } = useCosmeticStore();
  const {
    searchTerm,
    isLoading,
    handleSearch,
    filteredItems: filteredCosmetics
  } = useSearch(cosmetics);

  const handleSearchChange = useCallback((value) => {
    handleSearch(value);
  }, [handleSearch]);

  return {
    searchTerm,
    isLoading,
    filteredCosmetics,
    handleSearchChange
  };
};

export default useSearchDialog; 