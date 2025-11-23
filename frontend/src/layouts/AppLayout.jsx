import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AppLayout = ({ children }) => (
  <div className="flex min-h-screen bg-base-200">
    <Sidebar />
    <div className="flex flex-1 flex-col">
      <Topbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  </div>
);

export default AppLayout;
