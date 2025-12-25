"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Send,
  Heart,
  Sparkles,
  MessageSquare,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ApiResponse } from "@/types/ApiResponse";

// Define the message schema
const messageSchemaZod = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message is too long"),
});

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username[0];

  const form = useForm<z.infer<typeof messageSchemaZod>>({
    resolver: zodResolver(messageSchemaZod),
    defaultValues: {
      content: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const messageContent = form.watch("content");

  const placeholders = [
    "Share a secret you've been keeping...",
    "Tell them something they should know...",
    "What do you admire about them?",
    "Confess something you've been afraid to say...",
    "Share an anonymous compliment...",
  ];

  // Create animated background elements
  useEffect(() => {
    setIsMounted(true);

    // Rotate through placeholders
    const interval = setInterval(() => {
      if (!isTyping) {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTyping, placeholders.length]);

  const onSubmit = async (data: z.infer<typeof messageSchemaZod>) => {
    setIsLoading(true);
    try {
      // Make the actual API call
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      
      toast.success(response.data.message);
      setMessageSent(true);
      form.reset({ content: "" });

      // Reset after animation completes
      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to send message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
  };

  const messageSentAnimation = {
    initial: { y: 0, opacity: 1 },
    animate: {
      y: -80,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#131313] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        <motion.div
          className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="p-8 sm:p-10">
            <motion.div className="text-center mb-8" variants={popIn}>
              <div className="mb-4 inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
                <MessageSquare size={32} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Send a message to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 ml-2">
                  @{username}
                </span>
              </h1>
              <p className="text-gray-300 max-w-lg mx-auto">
                Your message will be completely anonymous. Have fun and be kind!
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!messageSent ? (
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="max-w-2xl mx-auto space-y-6"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeInUp}
                  key="message-form"
                >
                  <div className="relative">
                    <textarea
                      {...form.register("content")}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      placeholder={placeholders[placeholderIndex]}
                      className="w-full h-48 p-4 rounded-xl bg-[#0F0F0F] border border-purple-500/30 focus:border-purple-500 focus:ring focus:ring-purple-500/20 focus:outline-none transition-all duration-300 resize-none text-white placeholder:text-gray-500"
                    />

                    <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                      {messageContent?.length || 0} / 500
                    </div>

                    {form.formState.errors.content && (
                      <p className="text-red-500 mt-1 text-sm">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className={`w-full py-4 mt-4 rounded-xl flex items-center justify-center font-medium text-lg 
                      ${
                        isLoading || !messageContent
                          ? "bg-purple-700/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
                      } 
                      transition-all duration-300`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-10"
                  key="message-sent"
                  initial="hidden"
                  animate="visible"
                  variants={popIn}
                >
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: 0, duration: 0.6 }}
                  >
                    <Sparkles size={48} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-1">Message Sent!</h3>
                  <p className="text-gray-300 mb-4">
                    Your secret is safe with us.
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={() => setMessageSent(false)}
                      className="text-purple-400 flex items-center hover:text-purple-300 transition-colors"
                    >
                      Send another message
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </motion.div>

                  {/* Flying message animation */}
                  <motion.div
                    className="absolute pointer-events-none"
                    variants={messageSentAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Heart size={20} className="text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1A1A1A] px-4 text-sm text-gray-400">
                  or
                </span>
              </div>
            </div>

            <motion.div className="text-center mt-6" variants={fadeInUp}>
              <p className="text-gray-300 mb-4">
                Want to receive anonymous messages too?
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <User size={18} className="mr-2" />
                Create Your Account
              </Link>
            </motion.div>
          </div>

          {/* Fun floating elements */}
          <div className="absolute top-10 right-10 opacity-50 animate-pulse">
            <div className="h-6 w-6 rounded-full bg-purple-500/30"></div>
          </div>
          <div
            className="absolute bottom-10 left-10 opacity-50 animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <div className="h-4 w-4 rounded-full bg-blue-500/30"></div>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-6 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          © {new Date().getFullYear()} tellMe. All messages are anonymous.
        </motion.div>
      </div>
    </div>
  );
}
