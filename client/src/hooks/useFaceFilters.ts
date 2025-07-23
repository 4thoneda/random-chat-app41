import { useState, useRef, useEffect } from 'react';
import { FaceFilter, FaceFilterService, faceFilters } from '../lib/faceFilters';

export function useFaceFilters(videoElement: HTMLVideoElement | null) {
  const [currentFilter, setCurrentFilter] = useState<FaceFilter | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const filterServiceRef = useRef<FaceFilterService | null>(null);

  useEffect(() => {
    if (videoElement && !filterServiceRef.current) {
      filterServiceRef.current = new FaceFilterService(videoElement);
    }

    return () => {
      if (filterServiceRef.current) {
        filterServiceRef.current.destroy();
        filterServiceRef.current = null;
      }
    };
  }, [videoElement]);

  const applyFilter = (filter: FaceFilter) => {
    if (!filterServiceRef.current) return;

    setCurrentFilter(filter);
    filterServiceRef.current.applyFilter(filter);
    setIsFilterActive(filter.id !== 'none');
  };

  const removeFilter = () => {
    const noFilter = faceFilters.find(f => f.id === 'none');
    if (noFilter) {
      applyFilter(noFilter);
    }
  };

  const getFilteredStream = (): MediaStream | null => {
    if (!filterServiceRef.current) return null;
    return filterServiceRef.current.getFilteredStream();
  };

  return {
    currentFilter,
    isFilterActive,
    applyFilter,
    removeFilter,
    getFilteredStream,
  };
}