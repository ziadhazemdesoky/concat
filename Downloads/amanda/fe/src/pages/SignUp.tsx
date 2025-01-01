// SignUp.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { IoClose } from "react-icons/io5";
import { signUp, googleSignIn } from "../utils/api";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      navigateToTransactions();
    }
  }, []);

  const navigateToTransactions = () => {
    try {
      window.location.href = "/transactions";
    } catch (error) {
      console.error("Navigation error:", error);
      setError("Failed to navigate after successful sign up");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    };

    if (!firstName.trim()) {
      newFieldErrors.firstName = "First name required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newFieldErrors.lastName = "Last name required";
      isValid = false;
    }

    if (!email.trim()) {
      newFieldErrors.email = "Valid email required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = "Valid email required";
      isValid = false;
    }

    if (!phone.trim()) {
      newFieldErrors.phone = "Mobile required";
      isValid = false;
    }

    if (!password) {
      newFieldErrors.password = "Password must contain 8 characters + 1 letter and 1 number";
      isValid = false;
    } else {
      const hasMinLength = password.length >= 8;
      const hasLetter = /[A-Za-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);

      if (!hasMinLength || !hasLetter || !hasNumber) {
        newFieldErrors.password = "Password must contain 8 characters + 1 letter and 1 number";
        isValid = false;
      }
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp(firstName, lastName, email, phone, password);

      if (res.status === "success") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        navigateToTransactions();
      } else {
        setError(res.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await googleSignIn(credentialResponse);

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigateToTransactions();
      } else {
        throw new Error(response.data.message || "Failed to sign up with Google");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-600">Sign Up for CanCat</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="relative flex text-sm">
              <span className="text-lg bg-white text-indigo-600">Create a new account with Google</span>
            </div>

            <div className="w-full flex justify-center">
              <div style={{ width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Sign up failed")}
                  theme="outline"
                  size="large"
                  width="100%"
                  text="signup_with"
                  shape="rectangular"
                  useOneTap
                />
              </div>
            </div>

            <div className="relative flex justify-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="relative flex text-sm">
                  <span className="text-lg bg-white text-indigo-600">Create new account using your email</span>
                </div>

                <div className="flex space-x-4">
                  <div className="w-1/2">
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-sm mb-1">{fieldErrors.firstName}</p>
                    )}
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="w-1/2">
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-sm mb-1">{fieldErrors.lastName}</p>
                    )}
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mb-1">{fieldErrors.email}</p>
                  )}
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-sm mb-1">{fieldErrors.phone}</p>
                  )}
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Mobile Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm mb-1">{fieldErrors.password}</p>
                  )}
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                    <br />
                    <span className="text-slate-700 font-light italic">
                      must contain 8 characters + 1 letter and 1 number
                    </span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Are you an accountant or financial professional?
                    <br />
                    <span className="text-slate-700 font-light italic">
                      "Yes" if you plan to invite your clients to use CanCat.
                    </span>
                  </label>
                  <div className="mt-2 flex justify-center items-center space-x-2">
                    <span className="text-sm text-gray-500">No</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        disabled={isLoading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-sm text-gray-500">Yes</span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-bold uppercase text-white ${
                      isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {isLoading ? 'Signing up...' : 'Sign up'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;