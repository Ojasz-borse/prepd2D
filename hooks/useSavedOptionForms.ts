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
      const isDuplicate = savedForms.some((form) => {
        return JSON.stringify(form.results) === JSON.stringify(results);
      });

      if (isDuplicate) {
        console.log("Duplicate form detected. Not saving.");
        return false;
      }
      
      const now = new Date();
      const formattedIST = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      const newForm: SavedForm = {
        id: Date.now().toString(),
        name: name || `Saved List ${formattedIST}`,
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
