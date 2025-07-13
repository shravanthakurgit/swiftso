import React from 'react';

export default function NotFound() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-2">Page not found</p>
      <a href="/" className="text-blue-500 underline">Go back to Home</a>
    </div>
  );
}
