import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  return (
    <div className="flex bg-background text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <Navbar />

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;