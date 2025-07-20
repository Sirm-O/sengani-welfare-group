
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, TrendingUp, Heart, ArrowRight, Briefcase, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const { toast } = useToast();
  const { signUp, signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      const { error } = await signIn(loginData.email, loginData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
          variant: "default",
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
          title: "Signup Failed",
          description: error.message || "Could not create your account. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created Successfully!",
          description: signupData.role === 'admin'
            ? "Your admin account is pending approval. An email has been sent to the system administrator."
            : "Welcome to Sengani Girls Welfare Group! You can now log in.",
          variant: "default",
        });
        setSignupData({ name: "", email: "", password: "", phone: "", role: "" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20 animate-fade-in">
          <div className="inline-block p-3 mb-6 bg-primary-foreground rounded-full shadow-md">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-4">
            Sengani Welfare Group
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Empowering our community through collective financial strength and mutual support.
            Join us to build a brighter future, together.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 md:mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Community Focused"
              description="Manage members, track contributions, and foster a strong, supportive group environment."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-secondary" />}
              title="Secure & Transparent"
              description="Reliable tracking of all financial activities with utmost security and clarity for all members."
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Growth Together"
              description="Monitor your group's financial health and progress with insightful analytics and reports."
            />
          </div>
        </div>

        {/* Login/Signup Forms */}
        <div className="max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Card className="shadow-xl border bg-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-primary">
                Join Sengani Welfare
              </CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Sign in to your account or create a new one to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-md">
                  <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Join Group</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <FormInput
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <FormInput
                      id="password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-6">
                  <form onSubmit={handleSignup} className="space-y-5">
                    <FormInput
                      id="name"
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <FormInput
                      id="signup-email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <FormInput
                      id="phone"
                      label="Phone Number"
                      placeholder="+254 712 345 678"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    <div className="space-y-2">
                      <Label htmlFor="signup-role" className="font-medium">Role</Label>
                      <Select onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value }))} value={signupData.role}>
                        <SelectTrigger id="signup-role" className="w-full">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" /> Member
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" /> Administrator (Requires Approval)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormInput
                      id="signup-password"
                      label="Create Password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full text-lg py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      Join Group
                      <ArrowRight className="ml-2 h-5 w-5" />
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

// Helper component for feature cards for better structure
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 md:p-8 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
    <div className="flex justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-center text-foreground">{title}</h3>
    <p className="text-muted-foreground text-center text-sm leading-relaxed">{description}</p>
  </div>
);

// Helper component for form inputs for consistency
const FormInput = ({ id, label, type = "text", placeholder, value, onChange, required = false }:
  { id: string, label: string, type?: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }
) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="font-medium">{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="py-2.5 px-3.5 text-base"
    />
  </div>
);

export default AuthPage;
