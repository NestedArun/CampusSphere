import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <Navbar />

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;