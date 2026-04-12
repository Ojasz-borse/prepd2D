import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '@saved_option_forms';

export interface SavedForm {
  id: string;
  name: string;
  date: string;
  results: any[];
}

export const useSavedOptionForms = () => {
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedForms = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSavedForms(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load saved forms', e);
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async (results: any[], name?: string) => {
    try {
      const newForm: SavedForm = {
        id: Date.now().toString(),
        name: name || `Saved List ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleString(),
        results,
      };
      const updatedForms = [newForm, ...savedForms];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
      setSavedForms(updatedForms);
      return true;
    } catch (e) {
      console.error('Failed to save form', e);
      return false;
    }
  };

  const deleteSavedForm = async (id: string) => {
    try {
      const updatedForms = savedForms.filter((f) => f.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedForms));
      setSavedForms(updatedForms);
      return true;
    } catch (e) {
      console.error('Failed to delete form', e);
      return false;
    }
  };

  useEffect(() => {
    loadSavedForms();
  }, []);

  return {
    savedForms,
    loading,
    saveForm,
    deleteSavedForm,
    refreshSavedForms: loadSavedForms,
  };
};
