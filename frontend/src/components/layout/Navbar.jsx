import { Search, Bell } from "lucide-react";

function Navbar() {
  return (
    <div className="h-16 border-b flex items-center justify-between px-6 bg-white">
      
      {/* SEARCH */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-1 w-80">
        <Search size={16} />
        <input
          placeholder="Search..."
          className="outline-none w-full text-sm"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Bell size={18} className="cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;