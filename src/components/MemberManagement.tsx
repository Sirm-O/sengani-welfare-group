
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added AvatarImage
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Phone, Mail, Eye, Edit, UserCheck, Search, UserX, Trash2, CalendarDays, DollarSignIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyShort } from "@/utils/currency";

interface Member {
  id: string; // Changed to string for better ID generation
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalContributions: number;
  status: 'active' | 'inactive' | 'suspended';
  avatarUrl?: string; // Optional avatar URL
}

// Generate a simple unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: generateId(),
      name: "Aisha Wanjala",
      email: "aisha.wanjala@example.com",
      phone: "+254722123456",
      joinDate: "2023-01-15",
      totalContributions: 24000,
      status: 'active',
      avatarUrl: "/placeholder.svg" // Replace with actual images or use initials
    },
    {
      id: generateId(),
      name: "Brian Kipchoge",
      email: "brian.kipchoge@example.com",
      phone: "+254711987654",
      joinDate: "2023-02-01",
      totalContributions: 18500,
      status: 'active',
    },
    {
      id: generateId(),
      name: "Chidinma Eze",
      email: "chidinma.eze@example.com",
      phone: "+254733456789",
      joinDate: "2023-03-10",
      totalContributions: 12000,
      status: 'inactive'
    },
    {
      id: generateId(),
      name: "David Mwangi",
      email: "david.mwangi@example.com",
      phone: "+254700112233",
      joinDate: "2022-11-05",
      totalContributions: 35000,
      status: 'suspended',
      avatarUrl: "/placeholder.svg"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newMember, setNewMember] = useState<Omit<Member, 'id' | 'joinDate' | 'totalContributions' | 'status'>>({
    name: "",
    email: "",
    phone: "",
    avatarUrl: ""
  });
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'new' | 'edit') => {
    const { name, value } = e.target;
    if (formType === 'new') {
      setNewMember(prev => ({ ...prev, [name]: value }));
    } else if (editingMember) {
      setEditingMember(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.email && newMember.phone) {
      const memberToAdd: Member = {
        id: generateId(),
        ...newMember,
        joinDate: new Date().toISOString().split('T')[0],
        totalContributions: 0,
        status: 'active'
      };
      setMembers(prev => [memberToAdd, ...prev]);
      setNewMember({ name: "", email: "", phone: "", avatarUrl: "" });
      setIsAddModalOpen(false);
      toast({ title: "Member Added", description: `${memberToAdd.name} has been successfully added.`, variant: 'default' });
    }
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
      setIsEditModalOpen(false);
      setEditingMember(null);
      toast({ title: "Member Updated", description: `${editingMember.name}'s details have been updated.`, variant: 'default' });
    }
  };

  const handleDeleteMember = (memberId: string) => {
    // Add confirmation dialog here in a real app
    const memberName = members.find(m => m.id === memberId)?.name || "Member";
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast({ title: "Member Deleted", description: `${memberName} has been removed.`, variant: 'destructive' });
  };

  const openEditModal = (member: Member) => {
    setEditingMember({ ...member });
    setIsEditModalOpen(true);
  };

  const openViewModal = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filteredMembers = useMemo(() =>
    members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
    ), [members, searchTerm]);

  const MemberStatusBadge = ({ status }: { status: Member['status']}) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    if (status === 'inactive') variant = 'outline';
    if (status === 'suspended') variant = 'destructive';
    return <Badge variant={variant} className="capitalize text-xs">{status}</Badge>;
  };

  return (
    <Card className="shadow-xl border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Member Management</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">View, add, edit, and manage your group members.</CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add New Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Member</DialogTitle>
                <DialogDescription>Fill in the details to add a new member to the group.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="grid gap-4 py-4">
                <FormInputRow label="Full Name" id="name-new" name="name" value={newMember.name} onChange={(e) => handleInputChange(e, 'new')} placeholder="e.g., John Doe" required />
                <FormInputRow label="Email Address" id="email-new" name="email" type="email" value={newMember.email} onChange={(e) => handleInputChange(e, 'new')} placeholder="e.g., john.doe@example.com" required />
                <FormInputRow label="Phone Number" id="phone-new" name="phone" value={newMember.phone} onChange={(e) => handleInputChange(e, 'new')} placeholder="e.g., +2547XXXXXXXX" required />
                <FormInputRow label="Avatar URL (Optional)" id="avatarUrl-new" name="avatarUrl" value={newMember.avatarUrl || ""} onChange={(e) => handleInputChange(e, 'new')} placeholder="e.g., https://example.com/avatar.png" />
                <DialogFooter className="mt-2">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Add Member</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 relative">
          <Input
            type="search"
            placeholder="Search members by name, email, or phone..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredMembers.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1.5" />{member.email}</span>
                        <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5" />{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                     <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="font-semibold text-md text-green-600 dark:text-green-400 flex items-center sm:justify-end">
                           <DollarSignIcon className="h-4 w-4 mr-1"/> {formatCurrencyShort(member.totalContributions)}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Contributions</p>
                    </div>
                    <MemberStatusBadge status={member.status} />
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openViewModal(member)} className="text-muted-foreground hover:text-primary">
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>View Details</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(member)} className="text-muted-foreground hover:text-yellow-500">
                            <Edit className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit Member</p></TooltipContent>
                      </Tooltip>
                       <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete Member</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">No Members Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "Adjust your search criteria or " : "There are no members matching your search. "}
              add a new member to get started.
            </p>
          </div>
        )}
      </CardContent>
      {filteredMembers.length > 0 && (
        <CardFooter className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Showing {filteredMembers.length} of {members.length} members.</p>
        </CardFooter>
      )}

      {/* View Member Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Avatar className="h-10 w-10 mr-3 border">
                <AvatarImage src={selectedMember?.avatarUrl} alt={selectedMember?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{selectedMember ? getInitials(selectedMember.name) : "N/A"}</AvatarFallback>
              </Avatar>
              {selectedMember?.name}
            </DialogTitle>
            <DialogDescription>Detailed information for {selectedMember?.name}.</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4 text-sm">
              <InfoRow label="Status" value={<MemberStatusBadge status={selectedMember.status} />} />
              <InfoRow label="Email Address" value={selectedMember.email} icon={<Mail className="h-4 w-4 text-muted-foreground" />} />
              <InfoRow label="Phone Number" value={selectedMember.phone} icon={<Phone className="h-4 w-4 text-muted-foreground" />} />
              <InfoRow label="Join Date" value={new Date(selectedMember.joinDate).toLocaleDateString()} icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />} />
              <InfoRow label="Total Contributions" value={`KES ${selectedMember.totalContributions.toLocaleString()}`} icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />} className="font-semibold text-green-600 dark:text-green-400" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Member Details</DialogTitle>
            <DialogDescription>Update the information for {editingMember?.name}.</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleEditMember} className="grid gap-4 py-4">
              <FormInputRow label="Full Name" id="name-edit" name="name" value={editingMember.name} onChange={(e) => handleInputChange(e, 'edit')} required />
              <FormInputRow label="Email Address" id="email-edit" name="email" type="email" value={editingMember.email} onChange={(e) => handleInputChange(e, 'edit')} required />
              <FormInputRow label="Phone Number" id="phone-edit" name="phone" value={editingMember.phone} onChange={(e) => handleInputChange(e, 'edit')} required />
              <FormInputRow label="Avatar URL (Optional)" id="avatarUrl-edit" name="avatarUrl" value={editingMember.avatarUrl || ""} onChange={(e) => handleInputChange(e, 'edit')} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status-edit" className="text-right">Status</Label>
                <select
                    id="status-edit"
                    name="status"
                    value={editingMember.status}
                    onChange={(e) => setEditingMember(prev => prev ? { ...prev, status: e.target.value as Member['status'] } : null)}
                    className="col-span-3 block w-full rounded-md border-input bg-background p-2 text-sm focus:ring-ring focus:border-ring"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
              </div>
              <DialogFooter className="mt-2">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Helper component for form rows in modals
const FormInputRow = ({ label, id, name, value, onChange, type = "text", placeholder, required = false }:
  { label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; required?: boolean }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">{label}{required && <span className="text-destructive">*</span>}</Label>
    <Input id={id} name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} required={required} className="col-span-3" />
  </div>
);

// Helper component for info rows in view modal
const InfoRow = ({ label, value, icon, className }: { label: string; value: React.ReactNode; icon?: React.ReactNode, className?: string }) => (
  <div className="grid grid-cols-3 gap-2 items-center">
    <span className="font-medium text-muted-foreground col-span-1 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </span>
    <span className={cn("col-span-2", className)}>{value}</span>
  </div>
);

export default MemberManagement;
