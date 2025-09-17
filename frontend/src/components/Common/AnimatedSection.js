import React from 'react';
import { Box } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';

const AnimatedSection = ({ 
  children, 
  delay = 0, 
  animation = 'fadeInUp',
  sx = {},
  ...props 
}) => {
  const [ref, shouldAnimate] = useScrollAnimation(delay);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: shouldAnimate ? 'translateY(0)' : 'translateY(50px)',
      opacity: shouldAnimate ? 1 : 0,
    };

    switch (animation) {
      case 'fadeInUp':
        return baseStyles;
      case 'fadeInDown':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateY(0)' : 'translateY(-50px)',
        };
      case 'fadeInLeft':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(-50px)',
        };
      case 'fadeInRight':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'translateX(0)' : 'translateX(50px)',
        };
      case 'scaleIn':
        return {
          ...baseStyles,
          transform: shouldAnimate ? 'scale(1)' : 'scale(0.95)',
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

export default AnimatedSection;
