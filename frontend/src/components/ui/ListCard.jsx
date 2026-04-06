function ListCard({ title, children }) {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default ListCard;