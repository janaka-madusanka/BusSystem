import { Link } from "react-router-dom";
import {
  Bus,
  Info,
  LogIn,
  MapPin,
  ArrowRight,
} from "lucide-react";


function LandingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-950 px-4 text-white">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-green-300/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
          <Bus className="h-10 w-10" />
        </div>

        {/* Route Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
          <MapPin className="h-4 w-4" />
          Kuliyapitiya → Colombo
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-6xl font-black tracking-tight sm:text-7xl">
          BusTrak
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-2xl font-light italic text-white/90">
          Bus Timetable & Delay Tracker
        </p>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
          Check bus times, monitor live delays, and plan your
          journey with real-time updates — all in one place.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          {/* Enter Website */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-emerald-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
          >
            Enter Website
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* About */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            <Info className="h-4 w-4" />
            About the System
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>

        {/* Footer Text */}
        <p className="mt-16 text-xs tracking-wide text-white/50">
          Real-time bus tracking system for Sri Lankan commuters
        </p>
      </div>
    </main>
  );
}

export default LandingPage;