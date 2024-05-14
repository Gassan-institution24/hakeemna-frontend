import { useState, useEffect } from 'react';

export function useNewScreen() {
  const [newWin, setNewWin] = useState([]);

  useEffect(() => {
    const handleClose = () => {
      newWin.forEach((win) => {
        if (win && !win.closed) {
          win.close();
        }
      });
    };

    window.addEventListener('beforeunload', handleClose);

    return () => {
      window.removeEventListener('beforeunload', handleClose);
    };
  }, [newWin]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the changed key is related to sign-out
      if (event.key === 'userSignedOut') {
        // Close all child windows
        newWin.forEach((win) => {
          if (win && !win.closed) {
            win.close();
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [newWin]);

  const handleAddNew = (path) => {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const windowWidth = 700;
    const windowHeight = 600;
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;
    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`;
    const newWindow = window.open(path, '_blank', windowFeatures);
    setNewWin((prev) => [...prev, newWindow]);
    if (newWindow) {
      const sessionData = sessionStorage;
      newWindow.sessionStorage.clear();
      Object.keys(sessionData).forEach((key) => {
        newWindow.sessionStorage.setItem(key, sessionData[key]);
      });
      return newWindow;
    }
    console.error('Popup blocked. Please allow popups for this site.');
    return null;
  };
  return { handleAddNew };
}
