"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { initializeAuth } from "../state/authSlice";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [showSignUp, setShowSignUp] = React.useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {showSignUp ? (
          <SignUp onToggle={() => setShowSignUp(false)} />
        ) : (
          <SignIn onToggle={() => setShowSignUp(true)} />
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;