const Hamburgers = ({ ...props }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 7H20" stroke="inherit" strokeLinecap="round"/>
      <path d="M5 12H20" stroke="inherit" strokeLinecap="round"/>
      <path d="M5 17H20" stroke="inherit" strokeLinecap="round"/>
    </svg>
  )
}
export default Hamburgers;
