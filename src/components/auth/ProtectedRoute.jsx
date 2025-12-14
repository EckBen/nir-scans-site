import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Outlet } from "react-router";

export default function ProtectedRoute({ authorized, verified, initialized }) {
  let navigate = useNavigate();
  
  useEffect(() => {
    if (initialized) {
      if (!authorized) {
        // If not authenticated, redirect to login page
        navigate('/login');
      } else if (!verified) {
        // If not verified, redirect to unverified user page
        navigate('/unverified-user');
      }
    }
  }, [navigate, initialized, authorized, verified]);

  // If authenticated, render child routes (via Outlet)
  return <Outlet />;
}

ProtectedRoute.propTypes = {
  authorized: PropTypes.bool,
  verified: PropTypes.bool,
  initialized: PropTypes.bool
};