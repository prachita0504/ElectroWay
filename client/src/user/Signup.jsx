import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // if you’re using React Router v6

const Signup = () => {
  // 1) State hooks for each field + error message
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // If you want to navigate on success (e.g. to /login)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear any previous error

    // Optional: basic client‐side check before sending
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/signup",
        {
          email,
          username: name,
          password,
          confirmPassword,
        },
        {
          // withCredentials: true, // only if you’re using cookies/sessions
        }
      );

      console.log("Signup success:", res.data);
      // e.g. res.data.token

      // Redirect to /login (or wherever)
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response || err.message);

      // If your backend returns zod errors in err.response.data.error:
      if (err.response?.data?.error) {
        // zod returns an array of { path, message }. You can map them out:
        const zodErrors = err.response.data.error.map((e) => e.message);
        setErrorMsg(zodErrors.join(". "));
      } else if (err.response?.data?.message) {
        // General message from your route, e.g. “User already exists”
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900">
    <button
  onClick={() => navigate(-1)}
  className="absolute top-8 left-4 w-19 h-14 flex items-center justify-center rounded-full bg-green-400 hover:bg-green-500 text-black text-5xl font-bold shadow-lg transition"
  aria-label="Go back"
  title="Go back"
>
  ←
</button>
      <div className="max-w-md w-full bg-gray-900 bg-opacity-90 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Sign Up
        </h2>

        {errorMsg && (
          <p className="mb-4 text-center text-red-400">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-300 font-semibold"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500 text-black font-semibold py-3 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
