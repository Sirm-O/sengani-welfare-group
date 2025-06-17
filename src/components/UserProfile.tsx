
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Edit2,
  Shield,
  CreditCard,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2024-01-15",
    membershipType: "Premium",
    role: "Member"
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);
  const { toast } = useToast();

  const userStats = {
    totalContributions: 2400,
    totalWithdrawals: 500,
    currentBalance: 1900,
    transactionCount: 12,
    memberSince: "6 months"
  };

  const recentActivity = [
    { type: "Contribution", amount: 200, date: "2024-06-15" },
    { type: "Contribution", amount: 200, date: "2024-05-15" },
    { type: "Withdrawal", amount: 100, date: "2024-05-10" },
    { type: "Contribution", amount: 200, date: "2024-04-15" },
  ];

  const handleSaveProfile = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been saved.",
    });
  };

  const handleCancelEdit = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-gray-600">Manage your account information and view your activity</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={!isEditing ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" : ""}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xl font-semibold">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                  <div className="flex space-x-2">
                    <Badge variant="default">{userInfo.membershipType}</Badge>
                    <Badge variant="outline">{userInfo.role}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Editable Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedInfo.name}
                      onChange={(e) => setEditedInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{userInfo.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{userInfo.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedInfo.phone}
                      onChange={(e) => setEditedInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{userInfo.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{userInfo.joinDate}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSaveProfile} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest transactions and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'Contribution' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'Contribution' ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> :
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      activity.type === 'Contribution' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {activity.type === 'Contribution' ? '+' : '-'}${activity.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Security */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Financial Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Contributions</span>
                  <span className="font-semibold text-green-600">
                    ${userStats.totalContributions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Withdrawals</span>
                  <span className="font-semibold text-blue-600">
                    ${userStats.totalWithdrawals.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Current Balance</span>
                  <span className="font-bold text-lg">
                    ${userStats.currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Account Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userStats.transactionCount}</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userStats.memberSince}</p>
                  <p className="text-sm text-gray-600">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Password</span>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Two-Factor Auth</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Notifications</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
