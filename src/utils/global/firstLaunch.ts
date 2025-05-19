// src/hooks/useFirstLaunch.ts
import {useEffect, useState} from 'react';
import {storage} from '../../services/localStorage/storage.service';

export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = () => {
      const alreadyLaunched = storage.getBoolean('alreadyLaunched');
      if (alreadyLaunched === undefined) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return isFirstLaunch;
};
