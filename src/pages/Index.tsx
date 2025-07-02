
import { useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/auth/AuthPage";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button"; // Added
import { Loader2, MailWarning, RefreshCw } from "lucide-react"; // Added

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground font-medium">Loading application...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto p-8 sm:p-10 bg-card shadow-xl rounded-xl border border-border">
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border-4 border-yellow-200 dark:border-yellow-800/50">
            <MailWarning className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Admin Approval Pending</h2>
          <p className="text-muted-foreground mb-8 text-base leading-relaxed">
            Your administrator account for <span className="font-semibold text-primary">Sengani Welfare Group</span> has been created successfully.
            It is currently awaiting approval from an existing system administrator.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            An email notification has been sent. You will be notified once your account is approved.
            If you have questions, please contact support.
          </p>
          <Button
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full sm:w-auto group"
          >
            <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Refresh Approval Status
          </Button>
        </div>
      </div>
    );
  }

  return <Dashboard userRole={profile.role} userName={profile.full_name || "User"} />;
};

export default Index;
