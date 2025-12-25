"use client";
import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { toast } from "sonner";
import { motion } from "framer-motion";

import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";

const Verify = () => {
  const params = useParams();
  const username = params.username;
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  // Start countdown timer when resendCooldown > 0
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendAgain = async () => {
    if (resendCooldown > 0) return; // Prevent resend if still in cooldown

    try {
      const response = await axios.get(`/api/sendmail/${username}`);
      if (response.data.message) {
        toast.success(response.data.message);
        // Set a 60-second cooldown
        setResendCooldown(60);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(axiosError);
      toast(axiosError.response?.data.message ?? "Failed to send email");
    }
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsVerifying(true);
      if (username.length > 0) {
        try {
          const response = await axios.post("/api/verifycode", {
            username,
            code: otp,
          });

          console.log(response);
          if (response?.data?.success || response?.data?.status === 200) {
            router.replace("/signin");
            toast.success("success", {
              description: response?.data?.message,
            });
          }
        } catch (error) {
          console.log(error.response.data.message);
          toast(error.response.data.message);
          setIsVerifying(false);
        } finally {
          setIsVerifying(false);
        }
      }
    } else {
      toast.error("Please enter a complete OTP");
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] px-3 sm:px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-b from-gray-900 to-black rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800"
      >
        <div className="space-y-1 sm:space-y-2 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white bg-clip-text">
            Verify Your Account
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Enter the 6-digit code sent to your device
          </p>
        </div>

        <div className="relative mt-4 sm:mt-6 mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg sm:rounded-xl blur-xl"></div>
          <div className="relative py-6 sm:py-8 md:py-10 px-3 sm:px-5 md:px-6 backdrop-blur-sm bg-black/30 rounded-lg sm:rounded-xl border border-gray-700">
            {/* Custom styled OTP input with proper spacing */}
            <div className="flex justify-center">
              <div className="grid grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="w-full flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      className="hidden"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={index}
                          className="w-9 h-10 sm:w-11 sm:h-12 md:w-14 md:h-16 text-center rounded-md sm:rounded-lg bg-gray-800 text-white border-gray-700 focus:border-blue-500 transition-all shadow-md"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <p className="text-gray-400 text-xs sm:text-sm text-center">
                Didn&apos;t receive a code?{" "}
                <button
                  onClick={sendAgain}
                  disabled={resendCooldown > 0}
                  className="text-blue-400 hover:text-blue-300 underline transition"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-4 sm:py-5 md:py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base md:text-lg transition-all shadow-lg"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </div>
          ) : (
            "Verify Account"
          )}
        </Button>

        <div className="text-center pt-1 sm:pt-2">
          <Link
            href={"/signin"}
            className="text-gray-400 hover:text-gray-300 text-xs sm:text-sm transition"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify;
