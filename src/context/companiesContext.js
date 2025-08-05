import React, { createContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'companies_table_state';

const getStoredState = () => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setStoredState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const initialState = {
  savedFilters: {},
  savedPage: 0,
  savedVisibleColumns: {},
  savedShowAll: false,
};

const CompaniesContext = createContext(initialState);

const CompaniesProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedState = getStoredState();
    return storedState || initialState;
  });

  useEffect(() => {
    setStoredState(state);
  }, [state]);

  const contextValue = useMemo(() => ({
    state,
    setState,
  }), [state, setState]);

  return (
    <CompaniesContext.Provider value={contextValue}>
      {children}
    </CompaniesContext.Provider>
  );
};

CompaniesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CompaniesContext, CompaniesProvider };