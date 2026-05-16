import { Link, useNavigate } from "react-router-dom";
import { Bus, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import authService from "../api/services/auth.service";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-950 p-10 text-white lg:flex lg:flex-col">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Bus className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-wide">BusTrak</span>
          </Link>
        </div>

        <div className="relative z-10 m-auto max-w-md">
          <h1 className="text-5xl font-black leading-tight">Join BusTrak</h1>
          <p className="mt-6 text-lg leading-8 text-white/80">
            Create your account to access live bus tracking and smart timetable updates.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-800">
              Create Account
            </h2>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <InputField
              icon={<User className="h-5 w-5 text-slate-400" />}
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />

            <InputField
              icon={<User className="h-5 w-5 text-slate-400" />}
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />

            <InputField
              icon={<Mail className="h-5 w-5 text-slate-400" />}
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              icon={<Lock className="h-5 w-5 text-slate-400" />}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <InputField
              icon={<Lock className="h-5 w-5 text-slate-400" />}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
            >
              {loading ? "Creating..." : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
      {icon}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent px-3 py-4 text-sm outline-none"
        required
      />
    </div>
  );
}

export default RegisterPage;