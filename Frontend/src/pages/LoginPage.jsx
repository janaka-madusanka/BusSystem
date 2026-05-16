import { Link, useNavigate } from "react-router-dom";
import { Bus, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

import authService from "../api/services/auth.service"; // ✅ USE SERVICE

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ USE AUTH SERVICE
      const data = await authService.login({
        email,
        password,
      });

      console.log(data);

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.token);

      // optional: save user
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Success");

      navigate("/home");
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* Left Side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-950 p-10 text-white lg:flex lg:flex-col">

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-green-300/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Bus className="h-6 w-6" />
            </div>

            <span className="text-2xl font-bold tracking-wide">
              BusTrak
            </span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto mb-auto max-w-md">
          <h1 className="text-5xl font-black leading-tight">
            Welcome Back
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80">
            Track your favourite buses, monitor delays,
            and manage your journeys with real-time updates.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-800">
              Login
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Sign in to continue
            </p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="flex items-center rounded-2xl border bg-slate-50 px-4 focus-within:ring-4 focus-within:ring-emerald-100">
                <Mail className="h-5 w-5 text-slate-400" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="flex items-center rounded-2xl border bg-slate-50 px-4 focus-within:ring-4 focus-within:ring-emerald-100">
                <Lock className="h-5 w-5 text-slate-400" />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-emerald-700"
            >
              Sign In
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;