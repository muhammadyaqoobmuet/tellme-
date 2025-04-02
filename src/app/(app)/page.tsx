"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import {
  Menu,
  Send,
  Eye,
  Lock,
  MessageSquare,
  User,
  Copy,
  ChevronRight,
  Star,
  X,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  // State management
  const [copyStatus, setCopyStatus] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    testimonials: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side rendering and scroll animations
  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      const featuresElement = document.getElementById("features");
      const howItWorksElement = document.getElementById("how-it-works");
      const testimonialsElement = document.getElementById("testimonials");

      if (featuresElement) {
        const featurePosition = featuresElement.offsetTop;
        setIsVisible((prev) => ({
          ...prev,
          features: scrollPosition > featurePosition - windowHeight + 200,
        }));
      }

      if (howItWorksElement) {
        const howItWorksPosition = howItWorksElement.offsetTop;
        setIsVisible((prev) => ({
          ...prev,
          howItWorks: scrollPosition > howItWorksPosition - windowHeight + 200,
        }));
      }

      if (testimonialsElement) {
        const testimonialsPosition = testimonialsElement.offsetTop;
        setIsVisible((prev) => ({
          ...prev,
          testimonials:
            scrollPosition > testimonialsPosition - windowHeight + 200,
        }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Copy link functionality
  const copyLink = () => {
    const demoLink = "https://tellme.app/msg/yourprofile";
    navigator.clipboard.writeText(demoLink);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const rotateIn = {
    hidden: { opacity: 0, rotate: -5, scale: 0.95 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#131313] text-white overflow-hidden">
      {/* Animated Background Blur Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-full h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed py-2 top-0 left-0 right-0 z-50 bg-[#0F0F0F] backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                tell<span className="text-purple-500">me</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-1 bg-black/90 backdrop-blur-lg border-b border-white/5">
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="block px-3 py-2 text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/signup"
                className="block px-3 py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero Section */}
        <div className="py-16 md:py-28 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Receive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Mysterious
              </span>{" "}
              Messages From Anyone
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Share your personal tellme link and get anonymous messages,
              confessions, and surprises from friends and strangers.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Link
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 text-center text-lg font-medium"
              >
                Get Started{" "}
                <ChevronRight className="inline-block ml-1" size={18} />
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-900/20 transition-all duration-300 text-center text-lg font-medium"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className="bg-[#1A1A1A] rounded-2xl shadow-2xl p-6 border border-purple-500/30 relative z-10 max-w-md mx-auto"
              initial={{ rotate: 2, x: 20 }}
              animate={{ rotate: 2, x: 0 }}
              whileHover={{ rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.7,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-500 font-medium">New Message</span>
                <span className="text-gray-400 text-sm">Just now</span>
              </div>
              <p className="text-lg mb-6">
                &quot;I&apos;ve always admired your creativity and how
                you&apos;re not afraid to be yourself. You inspire me more than
                you know&quot;
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Anonymous</span>
                <button className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors">
                  <Send size={16} className="text-purple-400" />
                </button>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-10 -right-4 bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-purple-500/30 max-w-md z-0 hidden md:block"
              initial={{ rotate: -3, y: 20, opacity: 0 }}
              animate={{ rotate: -3, y: 0, opacity: 1 }}
              whileHover={{ rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.9,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-purple-500 font-medium">Secret</span>
                <span className="text-gray-400 text-sm">2h ago</span>
              </div>
              <p className="text-lg mb-6">
                &quot;That presentation you gave last week was amazing. I didnt
                have the courage to tell you in person.&quot;
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Anonymous</span>
                <button className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors">
                  <Send size={16} className="text-purple-400" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}

        <motion.div
          id="features"
          className="py-16 md:py-24"
          initial="hidden"
          animate={isVisible.features ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              tellme
            </span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 group"
              variants={fadeInUp}
            >
              <div className="bg-purple-500/20 p-3 rounded-lg inline-block mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Lock size={24} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                Complete Anonymity
              </h3>
              <p className="text-gray-300">
                Senders remain 100% anonymous. We never collect or share
                identifying information.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 group"
              variants={fadeInUp}
            >
              <div className="bg-purple-500/20 p-3 rounded-lg inline-block mb-4 group-hover:bg-purple-500/30 transition-colors">
                <MessageSquare size={24} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                Customizable Link
              </h3>
              <p className="text-gray-300">
                Create your own unique tellMe link that you can share on social
                media or with friends.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 group"
              variants={fadeInUp}
            >
              <div className="bg-purple-500/20 p-3 rounded-lg inline-block mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Eye size={24} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                Interactive Dashboard
              </h3>
              <p className="text-gray-300">
                Track message statistics, share on social media and save as best
                or worst memories.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          id="how-it-works"
          className="py-16 md:py-24"
          initial="hidden"
          animate={isVisible.howItWorks ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            variants={fadeInUp}
          >
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              tellMe
            </span>{" "}
            Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"></div>

            <motion.div
              className="flex flex-col items-center text-center"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10 shadow-lg shadow-purple-500/20">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Create Your Account
              </h3>
              <p className="text-gray-300">
                Sign up for free and set up your personal profile with a unique
                tellMe link.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10 shadow-lg shadow-purple-500/20">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Link</h3>
              <p className="text-gray-300">
                Share your tellMe link on social media or directly with your
                friends.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              variants={fadeInUp}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10 shadow-lg shadow-purple-500/20">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Messages</h3>
              <p className="text-gray-300">
                Start receiving anonymous messages and interact with them in
                your dashboard.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call To Action Section */}
        <motion.div
          className="py-16 md:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-gradient-to-r from-purple-900/40 to-purple-600/40 rounded-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm border border-purple-500/20">
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Ready to Discover Your Secret Messages?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Join thousands of users already receiving anonymous messages.
                Create your account and share your link today!
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <Link
                  href="/signup"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 text-center text-lg font-medium"
                >
                  Create Your Link{" "}
                  <ArrowRight
                    className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    size={18}
                  />
                </Link>
              </motion.div>
              <motion.div
                className="bg-[#0F0F0F]/80 backdrop-blur-md rounded-xl p-4 max-w-md mx-auto border border-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                <div className="flex items-center">
                  <span className="flex-1 text-left truncate text-gray-300">
                    tellme.app/msg/yourprofile
                  </span>
                  <button
                    onClick={copyLink}
                    className="ml-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-300 flex items-center gap-1"
                  >
                    {copyStatus ? (
                      <span className="flex items-center">
                        <Star size={14} className="mr-1" />
                        {copyStatus}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy size={14} className="mr-1" />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          id="testimonials"
          className="py-16 md:py-24"
          initial="hidden"
          animate={isVisible.testimonials ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={fadeInUp}
          >
            What Our Users Say
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              variants={rotateIn}
            >
              <p className="text-lg mb-6 italic relative">
                <span className="absolute -top-2 -left-2 text-4xl text-purple-500/30">
                  &quot;
                </span>
                I was shocked by the heartfelt messages I received. People
                shared things they&apos;d never tell me in person. tellMe
                revealed a whole new side to my relationships.
                <span className="absolute -bottom-2 -right-2 text-4xl text-purple-500/30">
                  &quot;
                </span>
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white mr-3">
                  <User size={18} />
                </div>
                <div>
                  <p className="font-medium">Sarah K.</p>
                  <p className="text-gray-400 text-sm">User since 2025</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              variants={rotateIn}
            >
              <p className="text-lg mb-6 italic relative">
                <span className="absolute -top-2 -left-2 text-4xl text-purple-500/30">
                  &quot;
                </span>
                As someone who&apos;s shy, tellMe helped me express feelings to
                friends I couldn&apos;t say out loud. The anonymity gave me the
                confidence to be honest without fear.
                <span className="absolute -bottom-2 -right-2 text-4xl text-purple-500/30">
                  &quot;
                </span>
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white mr-3">
                  <User size={18} />
                </div>
                <div>
                  <p className="font-medium">Marcus T.</p>
                  <p className="text-gray-400 text-sm">User since 2025</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold">
                tell
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                  me
                </span>
              </span>
              <p className="text-gray-400 mt-2">
                Unveil the mysteries of anonymous communication.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-medium mb-3 text-purple-400">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#how-it-works"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-lg font-medium mb-3 text-purple-400">
                  Legal
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-12">
            © {new Date().getFullYear()} tellme. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};



export default LandingPage;
