import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router'
import { ToastContainer, Bounce } from "react-toastify";

import { useAuth } from '../contexts/authContext';
import { useLoading } from '../contexts/loadingContext';

import TopNav from './TopNav';
import BreadCrumbs from './BreadCrumbs';
import Home from './Home';
import SamplesTable from './Tables/SamplesTable';
import SampleInformation from './Information/SampleInformation';
import PlantsTable from './Tables/PlantsTable';
import PlantInformation from './Information/PlantInformation';
import FieldsTable from './Tables/FieldsTable';
import FieldInformation from './Information/FieldInformation';
import Settings from './Settings';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './auth/Login';
import Verify from './auth/Verify';
import Recovery from './auth/Recovery';
import UnverifiedUser from './auth/UnverifiedUser';
import Loading from './Loading';

export default function App() {
  const location = useLocation();
  const { userAuth, getUser } = useAuth();
  const { isLoading } = useLoading();
  
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await getUser(true);
      setInitialized(true);
    })();
  },[]);

  return (
    <>
      {!['/login','/unverified-user','/verify'].includes(location.pathname) &&
        <>
          <TopNav />
          <BreadCrumbs />
        </>
      }
      
      <main
        className="relative flex flex-col items-center p-2"
      >
        <Routes>
          {/* Public routes */}
          <Route index path="login" element={<Login />} />
          <Route index path="verify" element={<Verify />} />
          <Route index path="recovery" element={<Recovery />} />

          {/* Protected routes - require authentication */}
          <Route
            element={
              <ProtectedRoute
                authorized={userAuth !== null}
                verified={userAuth && userAuth?.emailVerification}
                initialized={initialized}
              />
            }
          >
            <Route index path="unverified-user" element={<UnverifiedUser />} />

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
          </Route>
        </Routes>

        {isLoading && <Loading />}
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
    </>
  );
}