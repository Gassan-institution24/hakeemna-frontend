import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store/index.js";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import Cities from "./pages/fixedData/locationInfo/cities.js";
import Countries from "./pages/fixedData/locationInfo/countries.js";

function App() {
  return (
    <div className="App">
      <Provider store={Store}>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/countries" element={<Countries />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
