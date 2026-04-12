import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

function AppLayout({ children }) {
  return (
    <div className="flex bg-background text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
