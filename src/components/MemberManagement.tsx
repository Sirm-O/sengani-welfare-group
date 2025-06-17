
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Phone, Mail, Eye, Edit, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalContributions: number;
  status: 'active' | 'inactive';
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      joinDate: "2024-01-15",
      totalContributions: 2400,
      status: 'active'
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      joinDate: "2024-02-01",
      totalContributions: 1800,
      status: 'active'
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567892",
      joinDate: "2024-03-10",
      totalContributions: 1200,
      status: 'inactive'
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMember.name && newMember.email && newMember.phone) {
      const member: Member = {
        id: members.length + 1,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        joinDate: new Date().toISOString().split('T')[0],
        totalContributions: 0,
        status: 'active'
      };

      setMembers([...members, member]);
      setNewMember({ name: "", email: "", phone: "" });
      setIsAddingMember(false);
      
      toast({
        title: "Member added successfully!",
        description: `${member.name} has been added to the welfare group.`,
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-gray-600">Manage your welfare group members</p>
        </div>
        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Add a new member to your welfare group
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name</Label>
                <Input
                  id="member-name"
                  placeholder="Enter member's full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  placeholder="Enter member's email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-phone">Phone Number</Label>
                <Input
                  id="member-phone"
                  placeholder="Enter member's phone number"
                  value={newMember.phone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">Add Member</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingMember(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {members.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {member.phone}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">${member.totalContributions.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Contributions</p>
                  </div>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Member Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about {member.name}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedMember && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold text-lg">
                                {getInitials(selectedMember.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                              <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'}>
                                {selectedMember.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm text-gray-600">{selectedMember.email}</p>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                            </div>
                            <div>
                              <Label>Join Date</Label>
                              <p className="text-sm text-gray-600">{selectedMember.joinDate}</p>
                            </div>
                            <div>
                              <Label>Total Contributions</Label>
                              <p className="text-sm font-semibold text-green-600">
                                ${selectedMember.totalContributions.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;
