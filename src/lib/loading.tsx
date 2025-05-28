import { Loader2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
      >
        <ShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-600" />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse"
      >
        Loading your cart...
      </motion.p>
    </div>
  );
}
