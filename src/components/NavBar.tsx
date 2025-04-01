"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Menu, User, BarChart } from "lucide-react";

const NavBar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="bg-[#0F0F0F] text-white px-4 py-4  shadow-md w-full">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-4xl font-bold ">
              tell<span className="text-purple-500">me</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors"
                >
                  Dashboard
                </Link>
                {/* <Link
                  href="/dashboard/messages"
                  className="hover:text-purple-400 transition-colors"
                >
                  Messages
                </Link> */}
                {/* <Link
                  href="/dashboard/settings"
                  className="hover:text-purple-400 transition-colors"
                >
                  Settings
                </Link> */}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">
                      {user?.username || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 mt-2 border-t border-white/10 flex flex-col space-y-4">
            <Link
              href="/"
              className="hover:text-purple-400 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-purple-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {/* <Link
                  href="/dashboard/messages"
                  className="hover:text-purple-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link> */}
                {/* <Link
                  href="/dashboard/settings"
                  className="hover:text-purple-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link> */}
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">{user.name || "User"}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors w-full mt-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 mt-2 border-t border-white/10">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
