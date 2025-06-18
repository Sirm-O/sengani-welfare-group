
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, TrendingUp, Heart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "",
    role: ""
  });
  
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.name && signupData.email && signupData.password && signupData.phone && signupData.role) {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.name, 
        signupData.phone,
        signupData.role as 'user' | 'admin'
      );
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: signupData.role === 'admin' 
            ? "Your admin account has been created and is pending approval. An email has been sent to the system administrator."
            : "Welcome to Sengani Girls Welfare Group! You can now log in.",
        });
        
        // Reset form
        setSignupData({ name: "", email: "", password: "", phone: "", role: "" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Sengani Girls Welfare Group
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Empowering women through smart financial management. 
            Join, contribute, and grow together with our sisterhood.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Member Management</h3>
              <p className="text-gray-600">Easily add and manage group members with detailed profiles and contribution tracking.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <Shield className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Track all contributions and payments with bank-level security and transparency.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Growth</h3>
              <p className="text-gray-600">Monitor your group's financial progress with detailed analytics and reports.</p>
            </div>
          </div>
        </div>

        {/* Login/Signup Forms */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Sengani Girls</CardTitle>
              <CardDescription>
                Access your account or create a new one to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Join Group</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+254712345678"
                        value={signupData.phone}
                        onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-role">Role</Label>
                      <Select onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Member</SelectItem>
                          <SelectItem value="admin">Administrator (Requires Approval)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                      Join Group
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
