import { useState, useCallback, useRef, useMemo } from 'react';

const DEBOUNCE_DELAY = 300; // 300ms
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5분

const useSearch = (items, searchKeys = ['itemName', 'entpName']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const searchCache = useRef(new Map());

  // 캐시 키 생성 함수
  const getCacheKey = (term) => `${term}-${searchKeys.join('-')}`;

  // 캐시된 결과 가져오기
  const getCachedResult = (term) => {
    const key = getCacheKey(term);
    const cached = searchCache.current.get(key);
    
    if (!cached) return null;
    
    // 캐시 만료 확인
    if (Date.now() - cached.timestamp > CACHE_EXPIRATION) {
      searchCache.current.delete(key);
      return null;
    }
    
    return cached.items;
  };

  // 결과 캐싱
  const cacheResult = (term, items) => {
    const key = getCacheKey(term);
    searchCache.current.set(key, {
      items,
      timestamp: Date.now()
    });
  };

  // 검색 로직
  const performSearch = useCallback((term) => {
    const filtered = items.filter(item =>
      searchKeys.some(key =>
        item[key]?.toLowerCase().includes(term.toLowerCase())
      )
    );
    return filtered;
  }, [items, searchKeys]);

  // 디바운스된 검색 핸들러
  const handleSearch = useCallback(async (value) => {
    setSearchTerm(value);
    
    // 이전 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!value.trim()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // 새로운 타이머 설정
    debounceTimer.current = setTimeout(async () => {
      // 캐시 확인
      const cached = getCachedResult(value);
      if (cached) {
        setIsLoading(false);
        return;
      }

      // 실제 API 호출이나 복잡한 검색 로직이 있을 경우를 위한 딜레이 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = performSearch(value);
      cacheResult(value, results);
      setIsLoading(false);
    }, DEBOUNCE_DELAY);
  }, [performSearch]);

  // 검색 결과 메모이제이션
  const filteredItems = useMemo(() => {
    const cached = getCachedResult(searchTerm);
    if (cached) return cached;
    return performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  return {
    searchTerm,
    setSearchTerm,
    isLoading,
    handleSearch,
    filteredItems
  };
};

export default useSearch; 