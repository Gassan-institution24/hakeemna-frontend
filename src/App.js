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
import Diets from "./pages/fixedData/diets.js";
import Diseases from "./pages/fixedData/diseases.js";
import Stakeholdertypes from "./pages/stackholders/Stakeholdertypes.js"
import Stackholder from "./pages/stackholders/Stackholder.js";
import Suppliersoffers from "./pages/stackholders/Suppliersoffers.js";
import MedicalCategories from "./pages/fixedData/medicalCategories.js";
import Medicines from "./pages/fixedData/medicines.js";
import MedicinesFamilies from "./pages/fixedData/medicinesFamilies.js";
import Specialities from "./pages/fixedData/specialities.js";
import SubSpecialities from "./pages/fixedData/subSpecialities.js";

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
            <Route path="/diets" element={<Diets />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/medcats" element={<MedicalCategories />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medFamilies" element={<MedicinesFamilies />} />
            <Route path="/specialities" element={<Specialities />} />
            <Route path="/subspecialities" element={<SubSpecialities />} />
            <Route path='/customer' element={<Customer />}/>
            <Route path='/customeranalysis' element={<Customeranalysis />}/>
            <Route path='/drugsprescriptions' element={<Drugsprescriptions />}/>
            <Route path='/examinationreports' element={<Examinationreports />}/>
            <Route path='/edicalscans' element={<Medicalscans />}/>
            <Route path='/stakeholdertypes' element={<Stakeholdertypes />}/>
            <Route path='/stakeholder' element={<Stackholder />}/>
            <Route path='/suppliersoffers' element={<Suppliersoffers />}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
