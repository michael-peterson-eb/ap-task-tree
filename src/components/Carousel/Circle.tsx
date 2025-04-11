const Circle = ({ fill = "none", color = "white" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill={fill}
    >
      <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default Circle;
