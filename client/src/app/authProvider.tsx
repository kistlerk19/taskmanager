import React from "react";
import { AuthProvider as OidcAuthProvider, useAuth } from "react-oidc-context";

// Cognito OIDC Configuration using environment variables
const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  response_type: "code",
  scope: "email openid phone",
  // Additional recommended settings
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const AuthenticatedApp = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const logoutUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Show loading state while authentication is being determined
  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your dashboard
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => auth.signinRedirect()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the children
  return <>{children}</>;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OidcAuthProvider {...cognitoAuthConfig}>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </OidcAuthProvider>
  );
};

export default AuthProvider;