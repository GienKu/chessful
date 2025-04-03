import theme from './themes/dark';
import Layout from './layout/Layout';
import { ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import EmailVerificationOutcome from './pages/EmailVerificationOutcome';
import Unauthorized from './pages/Unauthorized';
import Forbidden from './pages/Forbidden';
import SocketProvider from './components/SocketProvider/SocketProvider';
import ActiveGame from './pages/ActiveGame';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import SnackbarProvider from './components/SnackbarProvider/SnackbarProvider';
import AnalyzeGame from './pages/AnalyzeGame';
// import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
// import Unauthorized from './pages/Unauthorized';
// import ResetPassword from './pages/ResetPassword';
// import NewPasswordForm from './pages/NewPasswordForm';
// import GeneralErrorBoundary from './components/GeneralErrorBoundary/GeneralErrorBoundary';

function App() {
  const { getUserData } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      await getUserData();
    };

    fetchData();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <GeneralErrorBoundary> */}
        <SocketProvider>
          <SnackbarProvider>
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
                <Route path="game/:gameId" element={<ActiveGame />}></Route>
                <Route
                  path="analyze-game/:gameId"
                  element={<AnalyzeGame />}
                ></Route>
                <Route path="player/:id" element={<Profile />}></Route>
                <Route path="friends" element={<Friends />}></Route>
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
          </SnackbarProvider>
        </SocketProvider>
        {/* </GeneralErrorBoundary> */}
      </ThemeProvider>
    </>
  );
}

export default App;
