import { Suspense } from 'react';
import * as process from 'process';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

window.global = window;
window.process = process;
// NOTE: do not assign window.Buffer here. app.jsx installs the real Buffer
// constructor from the `buffer` package, and this module's body runs *after*
// its imports — so assigning here overwrites it. A non-constructor value makes
// every `x instanceof Buffer` check throw ("right-hand side is not callable"),
// which breaks libraries that feature-detect Buffer (e.g. dicom-parser when
// decoding compressed DICOM).

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
