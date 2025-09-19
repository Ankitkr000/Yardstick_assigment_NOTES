import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const toggleRole = (value) =>
    setRole((prev) => (prev === value ? "" : value));
  const clearRole = () => setRole("");

  const toggleTenant = (value) =>
    setTenantSlug((prev) => (prev === value ? "" : value));
  const clearTenant = () => setTenantSlug("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!name || !email || !password || !role || !tenantSlug) {
        alert("Every field is required");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_BASE}/signup`, {
        name,
        email,
        password,
        role,
        tenantSlug,
      });

      setMessage({ type: "success", text: res.data.message });
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setTenantSlug("");

      alert("Signup successful!");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const boxClass = (selected) =>
    `flex-1 p-4 border rounded-xl text-center cursor-pointer transition select-none ${
      selected
        ? "border-black bg-black text-white"
        : "border-gray-300 bg-white text-black hover:border-black"
    }`;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white px-4">
 
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

   
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-black mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

        
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

       
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

        
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select Role</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => toggleRole("member")}
                onDoubleClick={clearRole}
                aria-pressed={role === "member"}
                className={boxClass(role === "member")}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => toggleRole("admin")}
                onDoubleClick={clearRole}
                aria-pressed={role === "admin"}
                className={boxClass(role === "admin")}
              >
                Admin
              </button>
            </div>
          </div>

       
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select Tenant</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => toggleTenant("acme")}
                onDoubleClick={clearTenant}
                aria-pressed={tenantSlug === "acme"}
                className={boxClass(tenantSlug === "acme")}
              >
                Acme
              </button>
              <button
                type="button"
                onClick={() => toggleTenant("globex")}
                onDoubleClick={clearTenant}
                aria-pressed={tenantSlug === "globex"}
                className={boxClass(tenantSlug === "globex")}
              >
                Globex
              </button>
            </div>
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-900 transition"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

     
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

    
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
