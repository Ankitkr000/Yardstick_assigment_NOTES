import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();



const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("❌ All fields are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
    const response = await axios.post(`${API_BASE}/login`, {
    email,
    password,
    });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", JSON.stringify(response.data.role));
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("tenant", response.data.tenant.name);
        localStorage.setItem(
          "plan",
          JSON.stringify(response.data.tenant.subscription)
        );

        setMessage("✅ Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setMessage(`❌ ${errorMessage}`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (testEmail) => {
    setEmail(testEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">



      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-200 shadow-sm">
        <Link to="/" className="text-2xl font-extrabold tracking-wide text-black">
          Notes SaaS
        </Link>
      </nav>





      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-lg w-full max-w-md">
   
          <h2 className="text-3xl font-bold text-center mb-2 text-black">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Login to continue to your dashboard
          </p>

 



          <form onSubmit={handleSubmit} className="space-y-6">
     
     
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

 
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

    
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>





          {message && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}





          <div className="mt-10">
            <h3 className="text-center text-base font-semibold mb-4 text-gray-700">
              Test Accounts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => fillTestAccount("admin@acme.test")}
                className="bg-white border border-gray-300 text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
              >
                Admin (Acme) (person1)
              </button>
              <button
                onClick={() => fillTestAccount("user@acme.test")}
                className="bg-white border border-gray-300 text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
              >
                Member (Acme) (person2)
              </button>
              <button
                onClick={() => fillTestAccount("admin@globex.test")}
                className="bg-white border border-gray-300 text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
              >
                Admin (Globex) (person3)
              </button>
              <button
                onClick={() => fillTestAccount("user@globex.test")}
                className="bg-white border border-gray-300 text-black p-3 rounded-lg hover:bg-black hover:text-white transition"
              >
                Member (Globex) (person4)
              </button>
            </div>
          </div>

          


           <div className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
