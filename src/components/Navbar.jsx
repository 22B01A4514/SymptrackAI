import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Heart, User, LogOut, Activity, Users, AlertTriangle, Video } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Heart className="w-8 h-8" />
                <span className="text-xl font-bold">SympTrack AI</span>
              </Link>
              
              {user && (
                <>
                  <div className="hidden md:flex items-center space-x-6">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link 
                      to="/predict" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Predict</span>
                    </Link>
                    
                    <Link 
                      to="/vlogs" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                    >
                      <Video className="w-4 h-4" />
                      <span>Patient Stories</span>
                    </Link>
                    
                    <Link 
                      to="/alerts" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Alerts</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{user.name}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;