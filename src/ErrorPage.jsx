import React from 'react'
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to='/'
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
