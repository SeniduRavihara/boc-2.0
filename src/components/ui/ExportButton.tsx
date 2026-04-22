import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick, isLoading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={18} className={isLoading ? "animate-bounce" : ""} />
      {isLoading ? "Exporting..." : "Export to Excel"}
    </motion.button>
  );
};
