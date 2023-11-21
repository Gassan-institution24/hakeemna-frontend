import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store/index.js";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import Cities from "./pages/fixedData/locationInfo/cities.js";
import Countries from "./pages/fixedData/locationInfo/countries.js";
import Currency from "./pages/fixedData/locationInfo/currency.js";
import Customer from "./components/customer/Customer.js";
import Customeranalysis from './components/customer/Customeranalysis.js'
import Drugsprescriptions from './components/customer/Drugsprescriptions.js'
import Examinationreports from './components/customer/Examinationreports.js'
import Medicalscans from './components/customer/Medicalscans.js'
import Analysis from "./pages/fixedData/analysis.js";


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
            <Route path="/currency" element={<Currency />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path='/customer' element={<Customer />}/>
            <Route path='/customeranalysis' element={<Customeranalysis />}/>
            <Route path='/drugsprescriptions' element={<Drugsprescriptions />}/>
            <Route path='/examinationreports' element={<Examinationreports />}/>
            <Route path='/edicalscans' element={<Medicalscans />}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
