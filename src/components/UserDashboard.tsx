import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Calendar,
  History,
  Target,
  PiggyBank
} from "lucide-react";
import { formatCurrencyShort } from "@/utils/currency";

interface UserDashboardProps {
  userName: string;
}

const UserDashboard = ({ userName }: UserDashboardProps) => {
  // Mock user-specific data with Kenyan Shillings
  const userStats = {
    totalContributions: 2400,
    totalWithdrawals: 500,
    currentBalance: 1900,
    monthlyTarget: 200,
    thisMonthContribution: 200,
    nextPaymentDue: "2024-07-15"
  };

  const userTransactions = [
    { id: 1, type: "contribution", amount: 200, date: "2024-06-15", description: "Monthly contribution" },
    { id: 2, type: "contribution", amount: 200, date: "2024-05-15", description: "Monthly contribution" },
    { id: 3, type: "withdrawal", amount: 100, date: "2024-05-10", description: "Emergency withdrawal" },
    { id: 4, type: "contribution", amount: 200, date: "2024-04-15", description: "Monthly contribution" },
    { id: 5, type: "contribution", amount: 200, date: "2024-03-15", description: "Monthly contribution" },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Dashboard</h2>
          <p className="text-gray-600">Your personal financial overview in Sengani Girls Welfare Group</p>
        </div>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">Welcome back, {userName}!</h3>
              <p className="text-purple-100">Member of Sengani Girls Welfare Group</p>
              <Badge className="bg-white/20 text-white mt-2">Active Member</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrencyShort(userStats.currentBalance)}</div>
            <p className="text-xs text-gray-600">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrencyShort(userStats.totalContributions)}</div>
            <p className="text-xs text-gray-600">Lifetime contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <PiggyBank className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrencyShort(userStats.thisMonthContribution)}</div>
            <p className="text-xs text-gray-600">of {formatCurrencyShort(userStats.monthlyTarget)} target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-600">{userStats.nextPaymentDue}</div>
            <p className="text-xs text-gray-600">Monthly contribution</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Monthly Progress</span>
          </CardTitle>
          <CardDescription>Your contribution progress for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Monthly Target: {formatCurrencyShort(userStats.monthlyTarget)}</span>
              <span>Contributed: {formatCurrencyShort(userStats.thisMonthContribution)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(userStats.thisMonthContribution / userStats.monthlyTarget) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {userStats.thisMonthContribution >= userStats.monthlyTarget ? 
                "🎉 Monthly target achieved!" : 
                `${formatCurrencyShort(userStats.monthlyTarget - userStats.thisMonthContribution)} remaining to reach your target`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>My Transaction History</span>
          </CardTitle>
          <CardDescription>Your recent contributions and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTransactions.map((transaction) => (
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
                    <p className="font-medium">{transaction.description}</p>
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
    </div>
  );
};

export default UserDashboard;
