import React, { useState, ReactNode } from 'react';
import { 
  Home, 
  Brain, 
  Grid3X3, 
  Edit3, 
  FileText, 
  User,
  Calendar,
  Heart,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface DashboardProps {
  user: any;
  profile: any;
  results: any;
  onSectionChange: (section: string) => void;
  currentSection: string;
  children?: ReactNode;   // ✅ Add children to props
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  profile, 
  results, 
  onSectionChange, 
  currentSection,
  children            // ✅ Destructure children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'insights', label: 'Numerology Insights', icon: Brain },
    { id: 'loshu', label: 'Lo-Shu Grid', icon: Grid3X3 },
    { id: 'advanced', label: 'Advanced Numbers', icon: Calendar },
    { id: 'tuner', label: 'Name Tuner', icon: Edit3 },
    { id: 'compatibility', label: 'Compatibility', icon: Heart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const NavItem = ({ item }: { item: any }) => (
    <button
      onClick={() => {
        onSectionChange(item.id);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        currentSection === item.id
          ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NumenCoach
              </h1>
              <p className="text-xs text-gray-500">Numerology, explained</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.fullName || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {currentSection === 'loshu' ? 'Lo-Shu Grid' : currentSection}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>🇮🇳</span>
                <span>English</span>
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children} {/* ✅ FIXED: now the content will render */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
