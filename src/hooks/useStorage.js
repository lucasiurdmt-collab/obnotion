import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_DATA } from '../data/initialData';
import {
  onAuthChange,
  loginWithGoogle as fbLoginWithGoogle,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  logoutUser as fbLogoutUser,
  resetPassword as fbResetPassword,
  saveUserDataToCloud,
  loadUserDataFromCloud
} from '../services/firebase';

const STORAGE_KEY = 'obnotion_workspace_data_v1';

export function useStorage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

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

  const syncTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setIsSyncing(true);
        try {
          const cloudResult = await loadUserDataFromCloud(currentUser.uid);
          if (cloudResult.success && cloudResult.exists && cloudResult.data) {
            const cloudData = cloudResult.data;
            setData((prev) => {
              const merged = { ...INITIAL_DATA, ...prev, ...cloudData };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (e) {
                console.error(e);
              }
              return merged;
            });
            if (cloudData.lastSyncedAt) {
              setLastSynced(new Date(cloudData.lastSyncedAt));
            } else {
              setLastSynced(new Date());
            }
          } else if (cloudResult.success && !cloudResult.exists) {
            // First time user: save initial local data to cloud
            await saveUserDataToCloud(currentUser.uid, data);
            setLastSynced(new Date());
          }
        } catch (err) {
          console.error('Error syncing on auth change:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Save to localStorage immediately and debounce Cloud Sync when user is logged in
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving data to localStorage:', err);
    }

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    if (user) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          const res = await saveUserDataToCloud(user.uid, data);
          if (res.success) {
            setLastSynced(new Date());
          }
        } catch (err) {
          console.error('Auto cloud sync error:', err);
        } finally {
          setIsSyncing(false);
        }
      }, 1500);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [data, user]);

  const updateSection = (sectionKey, updater) => {
    setData((prev) => {
      const newValue = typeof updater === 'function' ? updater(prev[sectionKey]) : updater;
      return {
        ...prev,
        [sectionKey]: newValue
      };
    });
  };

  const syncToCloudNow = useCallback(async () => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    setIsSyncing(true);
    try {
      const res = await saveUserDataToCloud(user.uid, data);
      if (res.success) {
        setLastSynced(new Date());
      }
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [user, data]);

  const syncFromCloudNow = useCallback(async () => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    setIsSyncing(true);
    try {
      const res = await loadUserDataFromCloud(user.uid);
      if (res.success && res.exists && res.data) {
        setData((prev) => ({ ...INITIAL_DATA, ...prev, ...res.data }));
        setLastSynced(new Date());
      }
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

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
    importFullData,
    // Auth & Cloud Sync
    user,
    isLoggedIn: !!user,
    authLoading,
    isSyncing,
    lastSynced,
    loginWithGoogle: fbLoginWithGoogle,
    loginWithEmail: fbLoginWithEmail,
    registerWithEmail: fbRegisterWithEmail,
    logout: fbLogoutUser,
    resetPassword: fbResetPassword,
    syncToCloudNow,
    syncFromCloudNow
  };
}