"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IMessage } from "@/models/message.models";
import { acceptMessageSchemaZod } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ClipboardCopy, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Dashboard = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchemaZod>>({
    resolver: zodResolver(acceptMessageSchemaZod),
  });

  const { watch, register, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );

      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${messageId}`
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Message deleted successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete message"
      );
      // Revert the deletion if API call fails
      fetchMessages();
    }
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch toggle status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      if (response.data) {
        setMessages(response.data.messages || []);
        toast.success("Messages loaded successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitch = async () => {
    setIsSwitchLoading(true);
    try {
      const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: newValue,
      });

      setValue("acceptMessages", newValue);

      if (response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to update settings"
      );
      // Revert the switch value if API call fails
      fetchAcceptMessage();
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="p-8 bg-gray-900 rounded-xl border border-purple-500/30 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Please Login</h1>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => (window.location.href = "/signin")}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#131212] text-white">
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Profile Link Section */}
        <section className="mb-8 p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/30">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Your Anonymous Profile Link
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="text"
              value={profileUrl}
              readOnly
              className="bg-gray-900 border-gray-800 text-gray-300 flex-grow"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <ClipboardCopy size={16} className="mr-2" />
              Copy Link
            </Button>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            Share this link with others to receive anonymous messages
          </p>
        </section>

        {/* Settings Section */}
        <section className="mb-8 p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/30">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Settings
          </h2>
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitch}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-purple-600"
              />
              <Label htmlFor="acceptMessages" className="text-white">
                {isSwitchLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </div>
                ) : (
                  `Accept Messages: ${acceptMessages ? "On" : "Off"}`
                )}
              </Label>
            </div>
          </div>
        </section>

        {/* Messages Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-400">
              Your Messages
            </h2>
            <Button
              variant="default"
              onClick={fetchMessages}
              disabled={loading}
              className="text-black hover:text-white hover:border"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id as string}
                    messageId={message._id}
                    message={message.content}
                    timestamp={new Date(message.createdAt).toLocaleString()}
                    onDelete={handleDeleteMessage}
                    borderColor="border-purple-500/30"
                    messageType="Anonymous"
                  />
                ))
              ) : (
                <div className="col-span-2 p-8 bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/30 text-center">
                  <p className="text-gray-400">
                    No messages yet. Share your profile link to get started!
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
