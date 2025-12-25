"use client";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signInSchemaZod } from "@/schemas/signInSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Added missing import
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [isSubmitingForm, setIsSubmitingForm] = useState(false);
  const router = useRouter();
  // zod validation
  const form = useForm<z.infer<typeof signInSchemaZod>>({
    resolver: zodResolver(signInSchemaZod),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchemaZod>) => {
    setIsSubmitingForm(true);
    try {
      // Your signin logic here
      console.log("Form data:", data);
      // Example: await signIn("credentials", { ...data, redirect: false });
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (response.error) {
        toast.error(
          response.error || "error while login check your credentials"
        );
      } else {
        toast.success(
          response.status === 200 ? "Logined Succesfull" : "please wait"
        );
      }

      if (response.url) {
        // this comes when user gets login
        router.replace("/dashboard");
      }

      console.log(response);

      // Success handling
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsSubmitingForm(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0f0f0f] lg:text-5xl mb-4">
            Join True Feedback
          </h1>
          <p className="text-gray-600">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      type="text"
                      placeholder="email or username"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      type="password"
                      placeholder="*****"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitingForm}
              type="submit"
              className="w-full py-6  bg-purple-700 hover:bg-purple-800 rounded-xl font-medium text-lg transition-all"
            >
              {isSubmitingForm ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-400 font-semibold hover:underline"
          >
            create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
