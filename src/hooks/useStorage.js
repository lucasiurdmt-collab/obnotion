import { useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'obnotion_workspace_data_v1';

export function useStorage() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_DATA, ...JSON.parse(saved) };
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving data to localStorage:', err);
    }
  }, [data]);

  const updateSection = (sectionKey, updater) => {
    setData(prev => {
      const newValue = typeof updater === 'function' ? updater(prev[sectionKey]) : updater;
      return {
        ...prev,
        [sectionKey]: newValue
      };
    });
  };

  const resetToSampleData = () => {
    setData(INITIAL_DATA);
  };

  const importFullData = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      setData({ ...INITIAL_DATA, ...parsed });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    data,
    setData,
    updateSection,
    resetToSampleData,
    importFullData
  };
}