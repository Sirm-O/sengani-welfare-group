import { useState, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Added
import {
  Users,
  DollarSign,
  TrendingUp,
  LogOut,
  CreditCard,
  CalendarCheck2,
  ShieldCheck,
  ArrowRight,
  Settings,
  UserCircle,
  LayoutDashboard,
  FileText,
  Landmark,
  AlertTriangle,
  Activity,
  Users2,
  HandCoins,
  PiggyBank,
  ListChecks,
  HeartHandshake,
  Info // Added for tooltips
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

  const groupStats = {
    totalMembers: 12,
    totalContributions: 245000,
    thisMonthContributions: 21000,
    pendingPayments: 3,
    activeLoans: 2,
    loanAmount: 75000,
  };

  const recentTransactions = [
    { id: 1, member: "John Maina", amount: 2500, date: "2024-07-15", type: "contribution", description: "Monthly Contribution for July" },
    { id: 2, member: "Jane Wanjiru", amount: 15000, date: "2024-07-14", type: "loan_disbursement", description: "Emergency Loan (Approved)" },
    { id: 3, member: "Peter Otieno", amount: 2500, date: "2024-07-13", type: "contribution", description: "Monthly Contribution for July" },
    { id: 4, member: "Aisha Mohammed", amount: 5000, date: "2024-07-12", type: "loan_repayment", description: "Loan Installment Payment" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const StatCard = ({ title, value, icon, description, colorClass = "bg-primary", trend, tooltipContent }: { title: string, value: string | number, icon: ReactNode, description: string, colorClass?: string, trend?: string, tooltipContent?: string }) => (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ${colorClass} text-primary-foreground relative`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {tooltipContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100 hover:bg-white/20">
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover text-popover-foreground text-xs max-w-xs">
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs opacity-80">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="text-xs opacity-80 pt-0 pb-3">
          {trend}
        </CardFooter>
      )}
    </Card>
  );

  const TransactionIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'contribution': return <HandCoins className="h-5 w-5 text-green-500" />;
      case 'loan_disbursement': return <Landmark className="h-5 w-5 text-blue-500" />;
      case 'loan_repayment': return <PiggyBank className="h-5 w-5 text-purple-500" />;
      default: return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'contribution': return 'text-green-600 dark:text-green-400';
      case 'loan_disbursement': return 'text-blue-600 dark:text-blue-400';
      case 'loan_repayment': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg shadow-sm">
                <HeartHandshake className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary">Sengani Welfare Group</h1>
                <div className="flex items-center space-x-2 mt-0.5">
                  <p className="text-xs sm:text-sm text-muted-foreground">Financial Management Platform</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="text-xs px-2 py-0.5 cursor-help">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        {userRole === 'admin' ? 'Administrator' : 'Member'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Your current role in the system.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, <span className="font-semibold text-foreground">{userName}</span></span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 border-border hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Sign out of your account.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-none sm:flex sm:w-auto rounded-lg bg-muted p-1">
            {userRole === 'admin' && <TabItem value="overview" icon={<LayoutDashboard />}>Overview</TabItem>}
            {userRole === 'admin' && <TabItem value="members" icon={<Users2 />}>Members</TabItem>}
            {userRole === 'admin' && <TabItem value="payments" icon={<ListChecks />}>All Payments</TabItem>}
            <TabItem value="my-dashboard" icon={userRole === 'admin' ? <UserCircle /> : <LayoutDashboard />}>
              {userRole === 'admin' ? 'My Profile' : 'My Dashboard'}
            </TabItem>
            {userRole === 'user' && <TabItem value="profile" icon={<UserCircle />}>Profile</TabItem>}
          </TabsList>

          {userRole === 'admin' && (
            <>
              <TabsContent value="overview" className="space-y-6 md:space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-6">
                   <StatCard title="Total Members" value={groupStats.totalMembers} icon={<Users className="h-5 w-5 text-primary-foreground opacity-80" />} description="Active group members" colorClass="bg-primary" tooltipContent="Total number of registered and active members in the welfare group." />
                  <StatCard title="Total Contributions" value={`KES ${formatCurrencyShort(groupStats.totalContributions)}`} icon={<DollarSign className="h-5 w-5 text-primary-foreground opacity-80" />} description="Lifetime contributions" colorClass="bg-green-600 dark:bg-green-700" tooltipContent="Sum of all contributions made by members to date." />
                  <StatCard title="This Month's Contributions" value={`KES ${formatCurrencyShort(groupStats.thisMonthContributions)}`} icon={<TrendingUp className="h-5 w-5 text-primary-foreground opacity-80" />} description="Contributions this current month" colorClass="bg-secondary" tooltipContent="Total contributions received in the current calendar month." />
                  <StatCard title="Pending Payments" value={groupStats.pendingPayments} icon={<AlertTriangle className="h-5 w-5 text-primary-foreground opacity-80" />} description="Awaiting confirmation" colorClass="bg-orange-500 dark:bg-orange-600" tooltipContent="Number of payments (e.g., contributions, loan repayments) that are recorded but not yet confirmed/cleared." />
                  <StatCard title="Active Loans" value={groupStats.activeLoans} icon={<Landmark className="h-5 w-5 text-primary-foreground opacity-80" />} description="Currently disbursed loans" colorClass="bg-blue-500 dark:bg-blue-600" tooltipContent="Number of loans that have been disbursed and are currently outstanding." />
                  <StatCard title="Total Loaned Amount" value={`KES ${formatCurrencyShort(groupStats.loanAmount)}`} icon={<HandCoins className="h-5 w-5 text-primary-foreground opacity-80" />} description="Total value of active loans" colorClass="bg-purple-500 dark:bg-purple-600" tooltipContent="The total monetary value of all currently active and outstanding loans." />
                </div>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
                        <CardDescription className="text-muted-foreground">Latest financial activities in the group.</CardDescription>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>View All</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Go to the detailed payments page.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                        <Tooltip key={transaction.id}>
                          <TooltipTrigger asChild>
                            <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors cursor-default">
                              <div className="flex items-center space-x-4">
                                <div className="p-2.5 bg-card rounded-full shadow-sm border border-border">
                                  <TransactionIcon type={transaction.type} />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{transaction.member}</p>
                                  <p className="text-xs text-muted-foreground flex items-center">
                                    <CalendarCheck2 className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                    {transaction.date}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                                  {transaction.type.includes('disbursement') ? '-' : '+'}{`KES ${formatCurrencyShort(transaction.amount)}`}
                                </p>
                                <Badge variant={transaction.type.includes('contribution') ? 'default' : 'secondary'} className="capitalize text-xs mt-1">
                                  {transaction.type.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="font-semibold">{transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} by {transaction.member}</p>
                            <p className="text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">Date: {transaction.date} | Amount: KES {transaction.amount.toLocaleString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      )) : (
                        <p className="text-center text-muted-foreground py-4">No recent transactions to display.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="animate-fade-in">
                <MemberManagement />
              </TabsContent>

              <TabsContent value="payments" className="animate-fade-in">
                <PaymentTracker />
              </TabsContent>
            </>
          )}

          <TabsContent value="my-dashboard" className="animate-fade-in">
            {userRole === 'user' ? <UserDashboard userName={userName} /> : <UserProfile />}
          </TabsContent>

          {userRole === 'user' && (
            <TabsContent value="profile" className="animate-fade-in">
              <UserProfile />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

const TabItem = ({ value, children, icon }: { value: string, children: ReactNode, icon: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <TabsTrigger
        value={value}
        className="flex items-center space-x-2 px-3 py-2.5 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm hover:bg-background/80 transition-all"
      >
        {icon}
        <span>{children}</span>
      </TabsTrigger>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>View {children}</p>
    </TooltipContent>
  </Tooltip>
);

export default Dashboard;
