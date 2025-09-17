import React from 'react';
import { Card, Box } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  animation = 'fadeInUp',
  sx = {},
  ...props 
}) => {
  const [ref, shouldAnimate] = useScrollAnimation(delay);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: shouldAnimate ? 'translateY(0)' : 'translateY(30px)',
      opacity: shouldAnimate ? 1 : 0,
    };

    switch (animation) {
      case 'fadeInUp':
        return baseStyles;
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
      default:
        return baseStyles;
    }
  };

  return (
    <Box ref={ref} sx={getAnimationStyles()}>
      <Card
        sx={{
          ...sx,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
        {...props}
      >
        {children}
      </Card>
    </Box>
  );
};

export default AnimatedCard;
