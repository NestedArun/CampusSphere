import { Search, Bell } from "lucide-react";

function Navbar() {
  return (
    <div className="h-16 border-b flex items-center justify-between px-6 bg-primary border-soft/20">
      
      {/* SEARCH */}
      <div className="flex items-center gap-2 border border-soft/20 rounded-lg px-3 py-1 w-80 bg-primary">
        <Search size={16} className="text-soft" />
        <input
          placeholder="Search..."
         className="outline-none w-full text-sm bg-transparent placeholder-soft text-white"
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