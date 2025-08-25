"use client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalLoader({ loading = false }: { loading?: boolean }) {
  if (!loading) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="p-5 bg-white border rounded-2xl shadow-xl flex items-center space-x-3">
        {/* Spinner */}
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        {/* Text */}
        <span className="text-gray-700 font-medium text-lg">
          Loading...
        </span>
      </div>
    </motion.div>
  );
}
