/**
 * Animation utilities for Framer Motion
 * Provides consistent animation variants across the application
 */

import { Variants } from 'framer-motion';

/**
 * Fade in from bottom with upward motion
 * Usage: <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Simple fade in animation
 * Usage: <motion.div variants={fadeIn} initial="hidden" animate="visible" />
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Scale in animation - grows from slightly smaller
 * Usage: <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} />
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Container variant for staggered children animations
 * Usage: <motion.div variants={staggerContainer} initial="hidden" animate="visible">
 *          <motion.div variants={fadeInUp}>Child 1</motion.div>
 *          <motion.div variants={fadeInUp}>Child 2</motion.div>
 *        </motion.div>
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Utility for creating custom stagger delays
 * @param index - Item index in list
 * @param baseDelay - Base delay in seconds (default: 0.1)
 */
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return index * baseDelay;
};
