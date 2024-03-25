export function useNewScreen() {
  const handleAddNew = (path) => {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const windowWidth = 700;
    const windowHeight = 600;
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;
    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`;
    const newWindow = window.open(path, '_blank', windowFeatures);

    if (newWindow) {
      const sessionData = sessionStorage;
      newWindow.sessionStorage.clear();
      Object.keys(sessionData).forEach((key) => {
        newWindow.sessionStorage.setItem(key, sessionData[key]);
      });
    } else {
      console.error('Popup blocked. Please allow popups for this site.');
    }
  };
  return { handleAddNew };
}
