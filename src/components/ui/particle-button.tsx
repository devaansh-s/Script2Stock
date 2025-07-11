"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
}

function SuccessParticles({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-black dark:bg-white rounded-full pointer-events-none z-50"
          style={{ left: centerX, top: centerY }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
            y: [0, -Math.random() * 50 - 20],
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

export function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) await onClick(e);

    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false);
      if (onSuccess) onSuccess();
    }, successDuration);
  };

  return (
    <>
      {showParticles && <SuccessParticles buttonRef={buttonRef} />}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "relative transition-transform duration-100",
          showParticles && "scale-95",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2">
          {children}
          <MousePointerClick className="h-4 w-4" />
        </span>
      </Button>
    </>
  );
}
