import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./store/index.js";
import LoginPage from "./pages/login";
import Signup from "./pages/signup";
import Cities from "./pages/fixedData/locationInfo/cities.js";
import Countries from "./pages/fixedData/locationInfo/countries.js";
import Currency from "./pages/fixedData/locationInfo/currency.js";
import Customer from "./pages/customer/Customer.js";
import Medicalscans from "./pages/customer/Medicalscans.js";
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
import Added_value_tax_GD from "./pages/accounting/Added_value_tax_GD.js";
import Surgeries from "./pages/fixedData/surgeries.js";
import Symptoms from "./pages/fixedData/symptoms.js";
import AppointmentTypes from "./pages/shared/AppointmentTypes.js";
import Appointments from "./pages/shared/Appointments.js";
import Valuetax from "./pages/accounting/Valuetax.js";
import Deductionamount from "./pages/accounting/Deductionamount.js";
import Deductionconfig from "./pages/accounting/Deductionconfig.js";
import Hospital from "./pages/accounting/Hospital.js";
import Incomepayment from "./pages/accounting/Incomepayment.js";
import Licensmovment from "./pages/accounting/Licensmovment.js";
import Measurementtypes from "./pages/accounting/Measurementtypes.js";
import Paymentmethod from "./pages/accounting/Paymentmethod.js";
import Pricequotation from "./pages/accounting/Pricequotation.js";
import Providedservicemovement from "./pages/accounting/Providedservicemovement.js";
import Receiptpaymentvoucher from "./pages/accounting/Receiptpaymentvoucher.js";
import Servicetypes from "./pages/accounting/Servicetypes.js";
import Stockmanagement from "./pages/accounting/Stockmanagement.js"
import Totalprice from "./pages/accounting/Totalprice.js";
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
            <Route path="/surgeries" element={<Surgeries />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/appointypes" element={<AppointmentTypes />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path='/customer' element={<Customer />}/>
            
            {/* 
            <Route path='/customeranalysis' element={<Customeranalysis />}/>
            <Route path='/drugsprescriptions' element={<Drugsprescriptions />}/>
            <Route path='/examinationreports' element={<Examinationreports />}/> */}
            <Route path='/medicalscans' element={<Medicalscans />}/>
            <Route path='/stakeholdertypes' element={<Stakeholdertypes />}/>
            <Route path='/stakeholder' element={<Stackholder />}/>
            <Route path='/suppliersoffers' element={<Suppliersoffers />}/>
            <Route path='/taxgd' element={<Added_value_tax_GD />}/>
            <Route path='/valuetax' element={<Valuetax />}/>
            <Route path='/deductionamount' element={<Deductionamount />}/>
            <Route path='/deductionconfig' element={<Deductionconfig />}/>
            <Route path='/hospital' element={<Hospital />}/>
            <Route path='/incomepayment' element={<Incomepayment />}/>
            <Route path='/licensmovment' element={<Licensmovment />}/>
            <Route path='/measurementtypes' element={<Measurementtypes />}/>
            <Route path='/paymentmethod' element={<Paymentmethod />}/>
            <Route path='/pricequotation' element={<Pricequotation />}/>
            <Route path='/providedservicemovement' element={<Providedservicemovement />}/>
            <Route path='/receiptpaymentvoucher' element={<Receiptpaymentvoucher />}/>
            <Route path='/servicetypes' element={<Servicetypes />}/>
            <Route path='/stockmanagement' element={<Stockmanagement />}/>
            <Route path='/totalprice' element={<Totalprice />}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
