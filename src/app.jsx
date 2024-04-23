/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------
// import React, { useEffect } from 'react';
import { AuthProvider } from 'src/auth/context/jwt';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { LocalizationProvider } from 'src/locales';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';

// ----------------------------------------------------------------------

export default function App() {
  // useEffect(() => {
  //   document.addEventListener('copy', disableCopy);
  //   return () => {
  //     document.removeEventListener('copy', disableCopy);
  //   };
  // }, []);

  // const disableCopy = (e) => {
  //   e.preventDefault();
  // };

  // useEffect(() => {
  //   document.addEventListener('screenshot', disablescreenshot);
  //   return () => {
  //     document.removeEventListener('screenshot', disablescreenshot);
  //   };
  // }, []);

  // const disablescreenshot = (e) => {
  //   e.preventDefault();
  // };
  // const [screenshotDetected, setScreenshotDetected] = useState(false);

  // useEffect(() => {
  //   const handleScreenshot = () => {
  //     setScreenshotDetected(true);
  //     setTimeout(() => setScreenshotDetected(false), 1000);
  //   };

  //   document.addEventListener('screenshot', handleScreenshot);

  //   return () => {
  //     document.removeEventListener('screenshot', handleScreenshot);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (screenshotDetected) {
  //     document.body.style.pointerEvents = 'none';
  //   } else {
  //     document.body.style.pointerEvents = 'auto';
  //   }
  // }, [screenshotDetected]);

  const charAt = `
  ██████╗
  ██╔══██╗
  ██║░░██║
  ██║░░██║
  ██████╔╝
  ╚═════╝░
  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();

  return (
    <AuthProvider>
      <LocalizationProvider>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <SettingsDrawer />
                <ProgressBar />
                <div
                  lang="ar"
                  style={{ height: '100%', width: '100%', textTransform: 'capitalize' }}
                >
                  <Router />
                </div>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
