import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [coach, setCoach] = useState(
    localStorage.getItem('coach')
      ? JSON.parse(localStorage.getItem('coach'))
      : null
  );
  const [favoritesExercicesList, setfavoritesExercicesList] = useState(
    localStorage.getItem('favoritesExercicesList')
      ? JSON.parse(localStorage.getItem('favoritesExercicesList'))
      : null
  );

  useEffect(() => {
    if (favoritesExercicesList) {
      localStorage.setItem(
        'favoritesExercicesList',
        JSON.stringify(favoritesExercicesList)
      );
    } else {
      localStorage.removeItem('favoritesExercicesList');
    }
  }, [favoritesExercicesList]);

  useEffect(() => {
    if (coach) {
      localStorage.setItem('coach', JSON.stringify(coach));
    } else {
      localStorage.removeItem('coach');
    }



  }, [coach]);

  const AppStates = useMemo(
    () => ({
      coach,
      setCoach,
      favoritesExercicesList,
      setfavoritesExercicesList,
    }),
    []
  );

  return (
    <AppContext.Provider value={AppStates}>{children}</AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export default AppProvider;
