import React from 'react';
import { Box } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';

const MotionWrapper = ({ 
  children, 
  delay = 0, 
  animation = 'fadeInUp',
  duration = 0.6,
  sx = {},
  ...props 
}) => {
  const [ref, shouldAnimate] = useScrollAnimation(delay);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transform: shouldAnimate ? 'translateY(0)' : 'translateY(30px)',
      opacity: shouldAnimate ? 1 : 0,
    };

    switch (animation) {
      case 'fadeInUp':
        return baseStyles;
      case 'fadeInDown':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateY(0)' : 'translateY(-30px)',
        };
      case 'fadeInLeft':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(-30px)',
        };
      case 'fadeInRight':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(30px)',
        };
      case 'scaleIn':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'scale(1)' : 'scale(0.9)',
        };
      case 'rotateIn':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'rotate(0deg)' : 'rotate(5deg)',
        };
      case 'bounceIn':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'scale(1)' : 'scale(0.3)',
          transition: `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Box ref={ref} sx={{ ...getAnimationStyles(), ...sx }} {...props}>
      {children}
    </Box>
  );
};

export default MotionWrapper;
