import { useContext, createContext } from 'react';

// ----------------------------------------------------------------------

// Routes that hide the nav set this so Header and Main stretch to full width
// instead of reserving space for a rail that isn't rendered.
export const NavHiddenContext = createContext(false);

export const useNavHidden = () => useContext(NavHiddenContext);
