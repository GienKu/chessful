import theme from './themes/dark';
import Layout from './layout/Layout';
import { ThemeProvider } from '@mui/material';
import { Routes, Route, Router } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import EmailVerificationOutcome from './pages/EmailVerificationOutcome';
import Unauthorized from './pages/Unauthorized';
import Forbidden from './pages/Forbidden';
// import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
// import Login from './pages/Login';
// import Unauthorized from './pages/Unauthorized';
// import EmailVerificationFailure from './pages/EmailVerificationFailure';
// import EmailVerificationSuccess from './pages/EmailVerificationSuccess';
// import ResetPassword from './pages/ResetPassword';
// import NewPasswordForm from './pages/NewPasswordForm';
// import GeneralErrorBoundary from './components/GeneralErrorBoundary/GeneralErrorBoundary';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <GeneralErrorBoundary> */}
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />}></Route>
            {/* <Route path="login" element={<Login />}></Route> */}
            <Route path="unauthorized" element={<Unauthorized />}></Route>
            <Route path="forbidden" element={<Forbidden />}></Route>

            {/* 
            <Route
              path="new-password/:token"
              element={<NewPasswordForm />}
            ></Route> */}
            <Route
              path="verification-failure"
              element={<EmailVerificationOutcome isVerified={false} />}
            ></Route>
            <Route
              path="verification-success"
              element={<EmailVerificationOutcome isVerified={true} />}
            ></Route>

            <Route path="*" element={<NotFound />}></Route>

            {/* Protected routes */}

            {/* <Route
                element={
                  <ProtectedRoutes
                  neededPermission={[PERMISSIONS.canViewLicensePage]}
                  />
                  }
                  >
                  <Route path="licencja" element={<SystemInformation />}></Route>
                  </Route> */}
          </Routes>
        </Layout>
        {/* </GeneralErrorBoundary> */}
      </ThemeProvider>
    </>
  );
}

export default App;
