import React, { useState } from 'react';
import { Fab, Tooltip, Zoom, Box } from '@mui/material';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';

const FloatingActionButton = ({ 
  icon, 
  tooltip, 
  onClick, 
  color = 'primary',
  delay = 0,
  sx = {},
  ...props 
}) => {
  const [ref, shouldAnimate] = useScrollAnimation(delay);
  const [hovered, setHovered] = useState(false);

  return (
    <Zoom in={shouldAnimate} timeout={600}>
      <Box
        ref={ref}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Tooltip title={tooltip} placement="left">
          <Fab
            color={color}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
              ...sx,
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              },
            }}
            {...props}
          >
            {icon}
          </Fab>
        </Tooltip>
      </Box>
    </Zoom>
  );
};

export default FloatingActionButton;
