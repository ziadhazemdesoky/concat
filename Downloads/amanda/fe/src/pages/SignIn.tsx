// SignIn.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { IoClose } from "react-icons/io5";
import { signIn, googleSignIn } from "../utils/api";
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const checkOnboardingAndRedirect = async () => {
    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection.');
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE}/api/checkonboarding`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.onboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      handleNetworkError(error as Error, 'Check Onboarding and Redirect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkError = (error: Error, context: string) => {
    console.error('Network Error:', {
      context,
      errorType: error.name,
      errorMessage: error.message,
      online: navigator.onLine,
      timestamp: new Date().toISOString()
    });
    
    if (error.name === 'AbortError') {
      setError('Request timed out. Please try again.');
      return;
    }
    
    setError('Connection error. Please try again.');
  };
  
  const handleSuccess = async (credentialResponse: any) => {
    if (isLoading) return;

    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await googleSignIn(credentialResponse);
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setError('');
        await checkOnboardingAndRedirect();
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        handleNetworkError(error, 'Google Sign In');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      checkOnboardingAndRedirect();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!navigator.onLine) {
      setError('You appear to be offline. Please check your internet connection.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn(email, password);

      if (res.status === "success") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        setError('');
        await checkOnboardingAndRedirect();
      } else {
        setError(res.message);
      }
    } catch (error) {
      handleNetworkError(error as Error, 'Sign In');
    } finally {
      setIsLoading(false);
    }
  };
    
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold mx-2">Error!</strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <IoClose onClick={() => setError("")} className="fill-current h-6 w-6 text-red-500" />
            </span>
          </div>
        )}
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-600">Sign In</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => setError("Google sign in failed")}
                  theme="outline"
                  size="large"
                  width="300"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Need an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;