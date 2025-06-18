import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  LogOut, 
  Plus,
  Eye,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Shield
} from "lucide-react";
import MemberManagement from "./MemberManagement";
import PaymentTracker from "./PaymentTracker";
import UserProfile from "./UserProfile";
import UserDashboard from "./UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrencyShort } from "@/utils/currency";

interface DashboardProps {
  userRole: 'admin' | 'user';
  userName: string;
}

const Dashboard = ({ userRole, userName }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? "overview" : "my-dashboard");
  const { signOut } = useAuth();

  // Mock data with Kenyan Shillings
  const groupStats = {
    totalMembers: 12,
    totalContributions: 24500,
    thisMonthContributions: 2100,
    pendingPayments: 3
  };

  const recentTransactions = [
    { id: 1, member: "John Doe", amount: 200, date: "2024-06-15", type: "contribution" },
    { id: 2, member: "Jane Smith", amount: 150, date: "2024-06-14", type: "withdrawal" },
    { id: 3, member: "Mike Johnson", amount: 200, date: "2024-06-13", type: "contribution" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sengani Girls Welfare Group</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Financial Management System</p>
                  <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {userRole === 'admin' ? 'Administrator' : 'Member'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome, {userName}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${userRole === 'admin' ? 'grid-cols-4' : 'grid-cols-2'} lg:w-fit`}>
            {userRole === 'admin' && <TabsTrigger value="overview">Overview</TabsTrigger>}
            {userRole === 'admin' && <TabsTrigger value="members">Members</TabsTrigger>}
            {userRole === 'admin' && <TabsTrigger value="payments">All Payments</TabsTrigger>}
            <TabsTrigger value="my-dashboard">
              {userRole === 'admin' ? 'My Profile' : 'My Dashboard'}
            </TabsTrigger>
            {userRole === 'user' && <TabsTrigger value="profile">Profile</TabsTrigger>}
          </TabsList>

          {userRole === 'admin' && (
            <>
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Total Members</CardTitle>
                      <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{groupStats.totalMembers}</div>
                      <p className="text-xs opacity-90">Active group members</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Total Contributions</CardTitle>
                      <DollarSign className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrencyShort(groupStats.totalContributions)}</div>
                      <p className="text-xs opacity-90">Lifetime contributions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">This Month</CardTitle>
                      <TrendingUp className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrencyShort(groupStats.thisMonthContributions)}</div>
                      <p className="text-xs opacity-90">Monthly contributions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Pending</CardTitle>
                      <CreditCard className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{groupStats.pendingPayments}</div>
                      <p className="text-xs opacity-90">Pending payments</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activities in Sengani Girls Welfare Group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'contribution' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {transaction.type === 'contribution' ? 
                                <TrendingUp className="h-4 w-4 text-green-600" /> :
                                <CreditCard className="h-4 w-4 text-blue-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{transaction.member}</p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {transaction.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'contribution' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {transaction.type === 'contribution' ? '+' : '-'}{formatCurrencyShort(transaction.amount)}
                            </p>
                            <Badge variant={transaction.type === 'contribution' ? 'default' : 'secondary'}>
                              {transaction.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members">
                <MemberManagement />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentTracker />
              </TabsContent>
            </>
          )}

          <TabsContent value="my-dashboard">
            {userRole === 'user' ? <UserDashboard userName={userName} /> : <UserProfile />}
          </TabsContent>

          {userRole === 'user' && (
            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
