import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  delay = 0,
  prefix = '',
  suffix = '',
  variant = 'h3',
  ...props 
}) => {
  const [count, setCount] = useState(0);
  const [ref, shouldAnimate] = useScrollAnimation(delay);

  useEffect(() => {
    if (shouldAnimate) {
      let startTime;
      const startCount = 0;
      const endCount = parseInt(end.toString().replace(/[^\d]/g, ''));
      const suffixText = end.toString().replace(/[\d]/g, '');

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startCount + (endCount - startCount) * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [shouldAnimate, end, duration]);

  return (
    <Typography ref={ref} variant={variant} {...props}>
      {prefix}{count.toLocaleString()}{suffix}
    </Typography>
  );
};

export default AnimatedCounter;
