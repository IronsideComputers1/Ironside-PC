import React from 'react';

const HealthIcon = ({ ...props }) => (
  <svg
    width="48"
    height="45"
    viewBox="0 0 48 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 42H3V45H6V42Z" fill="#FF7070"/>
    <path d="M9 12H6V42H9V12Z" fill="#FF7070"/>
    <path d="M3 12H0V42H3V12Z" fill="#FF7070"/>
    <path d="M45 9H36V3H33V9H21V3H18V9H15V12H12V42H9V45H45V42H48V12H45V9ZM33 36H27V30H21V24H27V18H33V24H39V30H33V36ZM45 39H42V42H39V39H42V15H39V12H42V15H45V39Z" fill="#FF7070"/>
    <path d="M12 9H9V12H12V9Z" fill="#FF7070"/>
    <path d="M6 9H3V12H6V9Z" fill="#FF7070"/>
    <path d="M15 3H12V9H15V3Z" fill="#FF7070"/>
    <path d="M33 0H21V3H33V0Z" fill="#FF7070"/>
    <path d="M18 0H15V3H18V0Z" fill="#FF7070"/>
  </svg>
);

export default HealthIcon;
