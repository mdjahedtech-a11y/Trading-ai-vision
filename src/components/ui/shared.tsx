import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function Card({ children, className, gradient, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg overflow-hidden relative",
        gradient && "bg-gradient-to-br from-zinc-900 to-zinc-950",
        className
      )}
      {...props}
    >
      {children}
      {gradient && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      )}
    </motion.div>
  );
}

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-300",
    ghost: "hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
  };

  return (
    <button
      className={cn(
        "px-4 py-3 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
