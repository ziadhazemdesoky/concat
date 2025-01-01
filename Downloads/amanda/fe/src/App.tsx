// node_modules
import { useState, useEffect, ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastProvider } from "./components/ToastModule"; 

// pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TransactionsPage from "./pages/TransactionsPage";
import IncomePage from "./pages/IncomePage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import Profile from "./pages/Profile";
import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";
import Household from "./pages/Household";
import UploadPage from "./pages/UploadPage";
import TaxYearSelection from "./pages/TaxYearSelection";
import AdminHouseholds from "./pages/admin/Households";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

// components
import AdminHeader from "./components/AdminHeader";
import Header from "./components/Header";
import Subheader from "./components/Subheader";
import IntroHeader from "./components/IntroHeader";
import Footer from "./components/Footer";



const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const clientId =
    "980253608759-krprok4is8kto2rc79ft0kggad8lmhq5.apps.googleusercontent.com";

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    setIsAuthenticated(false);
  } finally {
    setIsLoading(false);
  }
};

checkAuth();
}, []);

if (isLoading) {
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
  </div>
);
}

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route
              path="/signin"
              element={
                <>
                  <IntroHeader />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <IntroHeader />
                  <SignUp />
                </>
              }
            />
            <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <Subheader />
                      <main className="flex-1">
                        <TransactionsPage />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
            <Route
              path="/accept-invitation/:id"
              element={
                <>
                  <IntroHeader />
                  <AcceptInvitationPage />
                </>
              }
            />
            <Route
              path="/income"
              element={
                <>
                  <Header />
                  <Subheader />
                  <IncomePage />
                </>
              }
            />
             <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <Subheader />
                      <main className="flex-1 flex items-center">
                        <DashboardPage />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <Subheader />
                  <main className="flex-1 flex items-center">
                    <TaxYearSelection />
                  </main>
                  <Footer />
                </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                <>
                  <Header />
                  <Subheader />
                  <ReportPage />
                </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                <>
                  <Header />
                  <Subheader />
                  <SettingsPage />
                </>
                </ProtectedRoute>
              }
            />
                <Route
              path="/help"
              element={
                <ProtectedRoute>
                <>
                  <Header />
                  <Subheader />
                  <HelpPage />
                </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/household"
              element={
                <>
                  <Header />
                  <Subheader />
                  <Household />
                </>
              }
            />
            <Route
              path="/upload"
              element={
                <>
                  <Header />
                  <Subheader />
                  <UploadPage />
                </>
              }
            />
            <Route 
              path="/" 
              element={<Navigate to="/expenses" replace />} 
              />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <Subheader />
                  <Profile />
                </>
              }
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/households" replace />}
            />
            <Route
              path="/admin/households"
              element={
                <ProtectedRoute>
                <>
                  <AdminHeader />
                  <AdminHouseholds />
                </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                <>
                  <AdminHeader />
                  <div>Users</div>
                </>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
      </ToastProvider> 
    </GoogleOAuthProvider>
  );
};

export default App;
