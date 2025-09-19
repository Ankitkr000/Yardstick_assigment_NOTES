import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
   


      <nav className="flex justify-between items-center px-20 py-8 border-b border-gray-200 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-wide">Notes SaaS</h1>
        <div className="space-x-8">
          <Link
            to="/login"
            className="px-7 py-3 text-lg font-semibold border border-black rounded-xl hover:bg-black hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-7 py-3 text-lg font-semibold border border-black rounded-xl hover:bg-black hover:text-white transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>




 
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 py-28">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-10 leading-tight max-w-4xl">
          Secure Multi-Tenant Notes Application
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-12 leading-relaxed">
          Manage your team’s notes with role-based access, strict tenant
          isolation, and flexible subscription plans. Built for modern SaaS
          businesses with simplicity and security in mind.
        </p>
        <Link
          to="/signup"
          className="px-10 py-5 text-lg font-bold bg-black text-white rounded-xl shadow-md hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </main>





      <section className="px-20 py-28 bg-gray-50 border-t border-gray-200">
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto text-center">
          <div className="p-10 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">Multi-Tenant Security</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Strict tenant isolation ensures Acme and Globex data never mix.
              Your company’s notes are always secure.
            </p>
          </div>

          <div className="p-10 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">Role-Based Access</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Admins manage users and subscriptions. Members focus only on their
              notes. Controlled, professional access.
            </p>
          </div>

          <div className="p-10 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4">Flexible Plans</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Start free with 3 notes per tenant. Upgrade to Pro for unlimited
              notes — applied instantly with no downtime.
            </p>
          </div>
        </div>
      </section>





      <footer className="py-10 text-center text-gray-500 border-t border-gray-200 text-sm">
        © {new Date().getFullYear()} Notes SaaS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
