import {
  motion,
  type Variants,
  type Transition,
  type Easing,
} from "framer-motion";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: "slide" | "fade" | "scale" | "verticalSlide" | "default";
  duration?: number;
}

type TransitionVariants = {
  [key in PageTransitionProps["variant"] as NonNullable<
    PageTransitionProps["variant"]
  >]: Variants;
};

const transitionVariants: TransitionVariants = {
  default: {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  },
  slide: {
    initial: { x: 20, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -20, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
  scale: {
    initial: { scale: 0.98, opacity: 0 },
    in: { scale: 1, opacity: 1 },
    out: { scale: 0.98, opacity: 0 },
  },
  verticalSlide: {
    initial: { y: 20, opacity: 0 },
    in: { y: 0, opacity: 1 },
    out: { y: -20, opacity: 0 },
  },
};

// Custom easing function that mimics "anticipate"
const anticipateEasing: Easing = [0.215, 0.61, 0.355, 1];

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
  variant = "default",
  duration = 0.2,
}) => {
  const pageTransition: Transition = {
    type: "tween",
    ease: anticipateEasing,
    duration,
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={transitionVariants[variant]}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
