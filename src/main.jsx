import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ToastContainer, Bounce, toast } from "react-toastify";

import { AuthProvider } from "./contexts/authContext";
import { DataProvider } from "./contexts/dataContext";
import { LoadingProvider } from "./contexts/loadingContext";
// import { CustomRoutingProvider } from "./contexts/routingContext";

import TopNav from './components/TopNav';
import BreadCrumbs from './components/BreadCrumbs';
import Home from './components/Home';
import SamplesTable from './components/SamplesTable';
import SampleInformation from './components/SampleInformation';
import PlantsTable from './components/PlantsTable';
import PlantInformation from './components/PlantInformation';
import FieldsTable from './components/FieldsTable';
import FieldInformation from './components/FieldInformation';
import Settings from './components/Settings';

import './main.css';

function toastIt() {
  toast.error('Test toast')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <CustomRoutingProvider> */}
        <LoadingProvider>
          <AuthProvider>
            <DataProvider>
              <TopNav />
              <BreadCrumbs />
              
              <main
                className="flex flex-col items-center p-2"
              >
                <Routes>
                  <Route index path="/" element={<Home />} />

                  <Route path="samples">
                    <Route index element={<SamplesTable />} />
                    <Route path=":sampleID" element={<SampleInformation />} />
                  </Route>
                  <Route path="plants">
                    <Route index element={<PlantsTable />} />
                    <Route path=":plantID" element={<PlantInformation />} />
                  </Route>
                  <Route path="fields">
                    <Route index element={<FieldsTable />} />
                    <Route path=":fieldID" element={<FieldInformation />} />
                  </Route>

                  <Route index path="settings" element={<Settings />} />
                </Routes>

                <button className='bg-gray-300 p-2 mt-10' onClick={toastIt}>Test Toast</button>
              </main>

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
              />
            </DataProvider>
          </AuthProvider>
        </LoadingProvider>
      {/* </CustomRoutingProvider> */}
    </BrowserRouter>
  </StrictMode>,
)
