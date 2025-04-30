// Button.jsx
import React from 'react';

export const Button = ({ onClick, children, variant }) => (
  <button onClick={onClick} className={`button ${variant ? `button--${variant}` : ''}`}>
    {children}
  </button>
);
