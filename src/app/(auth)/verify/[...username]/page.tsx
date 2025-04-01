"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import { toast } from "sonner";
import { motion } from "framer-motion";

import axios from "axios";

const Verify = () => {
  const params = useParams();
  const username = params.username;
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Form handling

  const router = useRouter();

  const handleComplete = (value) => {
    setOtp(value);
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsVerifying(true);
      // Simulate verification process
      if (username.length > 0) {
        try {
          const response = await axios.post("/api/verifycode", {
            username,
            code: otp,
          });
         
          console.log(response);
          if (response?.data?.success || response?.data?.status == 200) {
           
            router.replace("/signin");
            toast("success", {
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
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white bg-clip-text ">
            Verify Your Account
          </h1>
          <p className="text-gray-400">
            Enter the 6-digit code sent to your device
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl"></div>
          <div className="relative py-10 px-6 backdrop-blur-sm bg-black/30 rounded-xl border border-gray-700">
            <InputOTP
              maxLength={6}
              onComplete={handleComplete}
              className="justify-center gap-4"
            >
              <InputOTPGroup>
                {[0, 1, 2].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-14 text-center rounded-lg bg-gray-800 text-white border-gray-700 focus:border-blue-500 transition-all"
                  />
                ))}
              </InputOTPGroup>
              <InputOTPSeparator className="text-gray-500">-</InputOTPSeparator>
              <InputOTPGroup>
                {[3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-14 text-center rounded-lg bg-gray-800 text-white border-gray-700 focus:border-blue-500 transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="mt-8">
              <p className="text-gray-400 text-sm text-center mb-4">
                Didn&apos;t receive a code?{" "}
                <button className="text-blue-400 hover:text-blue-300 underline transition">
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium text-lg transition-all"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

        <div className="text-center">
          <button className="text-gray-400 hover:text-gray-300 text-sm transition">
            Back to login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify;
