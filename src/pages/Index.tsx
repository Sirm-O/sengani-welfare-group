
import { useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  // Check if admin user is approved
  if (profile.role === 'admin' && !profile.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Approval Pending</h2>
          <p className="text-gray-600 mb-6">
            Your administrator account has been created successfully but is pending approval. 
            Please contact the system administrator to approve your account.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard userRole={profile.role} userName={profile.full_name} />;
};

export default Index;
