import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppStore from '../stores/appStore';

const useUsername = () => {
  const { setUser } = useAppStore();

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error retrieving user from storage', error);
      }
    })();
  }, [setUser]);

  return {};
};

export default useUsername;
