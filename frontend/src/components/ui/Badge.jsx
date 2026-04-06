function Badge({ text, color = "gray" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[color]}`}>
      {text}
    </span>
  );
}

export default Badge;