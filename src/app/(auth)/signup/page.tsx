"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchemaZod } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Loader2} from "lucide-react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitingForm, setIsSubmitingForm] = useState(false);
  const router = useRouter();
  const debounceUsername = useDebounceCallback(setUsername, 700);
  // zod validations
  const form = useForm<z.infer<typeof signUpSchemaZod>>({
    resolver: zodResolver(signUpSchemaZod),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUniquenes = async () => {
      if (username) {
        // Only check if username is non-empty
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(response?.data.message);
        } catch (error) {
          if (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            // console.log("Axios error:", axiosError?.response?.data?.message  );
            setUsernameMessage(
              (axiosError.response?.data as { message?: string })?.message ||
                "An error occurred while fetching username "
            );
          } else {
            console.log("Non-Axios error:", error);
            setUsernameMessage("An unexpected error occurred");
          }
        } finally {
          setIsCheckingUsername(false); // Reset checking state
        }
      }
    };
    checkUserNameUniquenes();
  }, [username, debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchemaZod>) => {
    setIsSubmitingForm(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      if (response.status == 200 || response.data.message) {
        toast("Success", {
          description: response.data.message,
          action: {
            label: "ok",
            onClick: () => {
              console.log("trying something new");
            },
          },
        });
        router.replace(`/verify/${username}`);
        setIsSubmitingForm(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios error:", error.message);
        toast("Error sumbmiting form");
      } else {
        console.log("Non-Axios error:", error);
        setUsernameMessage("An unexpected error occurred");
      }
      setIsSubmitingForm(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl mb-4">
            Join True Feedback
          </h1>
          <p className="text-gray-600">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      onChange={(e) => {
                        field.onChange(e);
                        debounceUsername(e.target.value);
                      }}
                      placeholder="Enter your username"
                    />

                  </FormControl>
                  <FormMessage />
                  {isCheckingUsername && (
                    <Loader2 className=" animate-spin   w-5 h-5" />
                  )}
                  {usernameMessage && (
                    <p
                      className={`${
                        usernameMessage.includes("available")
                          ? "text-green-700"
                          : "text-red-800"
                      }  `}
                    >
                      {usernameMessage}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      type="password"
                      placeholder="*****"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmitingForm} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">
              {isSubmitingForm ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin  w-5 h-5" />
                  Signing up...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
