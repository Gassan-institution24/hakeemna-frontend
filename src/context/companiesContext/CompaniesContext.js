import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const STORAGE_KEY = 'companies_table_filters';

const defaultFilters = {
  name: '',
  USType: '',
  city: '',
  sector: '',
  province: '',
  speciality1: '',
  speciality2: '',
};

const defaultState = {
  filters: defaultFilters,
  showAll: false,
  enabledColumns: {},
  tablePage: 0,
};

const CompaniesContext = createContext();

export const CompaniesProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({ ...defaultState, ...parsed });
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [state]);

  const updateFilters = useCallback((newFilters) => {
    setState(prev => ({ ...prev, filters: { ...prev.filters, ...newFilters } }));
  }, []);

  const updateShowAll = useCallback((showAll) => {
    setState(prev => ({ ...prev, showAll }));
  }, []);

  const updateEnabledColumns = useCallback((enabledColumns) => {
    setState(prev => ({ ...prev, enabledColumns }));
  }, []);

  const updateTablePage = useCallback((tablePage) => {
    setState(prev => ({ ...prev, tablePage }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: defaultFilters }));
  }, []);

  const value = useMemo(() => ({
    ...state,
    updateFilters,
    updateShowAll,
    updateEnabledColumns,
    updateTablePage,
    resetFilters,
  }), [state, updateFilters, updateShowAll, updateEnabledColumns, updateTablePage, resetFilters]);

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
};

CompaniesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCompaniesContext = () => {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error('useCompaniesContext must be used within CompaniesProvider');
  }
  return context;
};

export default CompaniesProvider; 