import React, { useState } from "react";
import { Send, Trash2, X } from "lucide-react";


interface MessageCardProps {
  message?: string;
  timestamp?: unknown;
  isRead?: boolean;
  messageType?: string;
  messageId: unknown;
  rotationClass?: string;
  onDelete: (messageId: string) => void;
  borderColor?: string;
  zIndex?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  timestamp,
  isRead = false,
  messageType = "New Message",
  messageId,
  rotationClass = "",
  onDelete,
  borderColor = "border-purple-500/30",
  zIndex = "z-10",
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  console.log();
  console.log("message id from message card", messageId);
  return (
    <>
      <div
        className={`bg-[#1A1A1A] rounded-2xl shadow-lg p-6 border ${borderColor} ${rotationClass} relative ${zIndex} max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-purple-500 font-medium">{messageType}</span>
          <span className="text-gray-400 text-sm">{timestamp}</span>
        </div>

        <p className="text-lg mb-6 text-white">{message}</p>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Anonymous</span>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteAlert(true)}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-colors"
              aria-label="Delete message"
            >
              <Trash2 size={16} className="text-purple-400" />
            </button>

            <button
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-colors"
              aria-label="Share message"
            >
              <Send size={16} className="text-purple-400" />
            </button>
          </div>
        </div>

        {!isRead && (
          <div
            className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"
            aria-label="Unread message indicator"
          ></div>
        )}
      </div>

      {/* Professional Delete Confirmation Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0  bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1A1A1A] rounded-xl shadow-2xl max-w-lg w-full mx-2 overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                Delete Message
              </h3>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="rounded-full p-1 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-300">
                Are you sure you want to delete this message?
              </p>
            </div>

            <div className="px-6 py-4 bg-[#151515] flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Future delete functionality will go here
                  onDelete(messageId);
                  console.log(`Delete message with id: ${messageId}`);
                  setShowDeleteAlert(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageCard;
