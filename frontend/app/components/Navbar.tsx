"use client";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  LayoutDashboard,
  Newspaper,
  Bell
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleDash = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("../pages/dashboard");
    } else {
      router.push("../pages/signup");
    }
  };

  return (
    <div>
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleDash}
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <AlertTriangle size={20} />
            <span>FixMyCity</span>
          </button>

          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="../pages/maps"
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
            >
              <MapPin size={18} />
              <span>Map</span>
            </Link>
            <Link
              href="../pages/issues"
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
            >
              <AlertTriangle size={18} />
              <span>Issues</span>
            </Link>
            <Link
              href="../pages/dashboard"
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="../pages/report"
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
            >
              <Newspaper size={18} />
              <span>Report an Issue</span>
            </Link>
            <Link
              href="../pages/safety"
              className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100"
            >
              <Bell size={18} />
              <span>Your Location</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="md:hidden">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
