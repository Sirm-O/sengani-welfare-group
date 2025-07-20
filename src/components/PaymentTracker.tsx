
import { useState, useMemo, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, CalendarDays, DollarSign, TrendingUp, CreditCard, Filter, ArrowUpDown, Search, ListFilter, Edit2, Trash2, MoreHorizontal, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyShort } from "@/utils/currency"; // Assuming KES

// Generate a simple unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

type PaymentType = 'contribution' | 'withdrawal' | 'loan_disbursement' | 'loan_repayment' | 'fine' | 'interest_earned';
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'processing';

interface Payment {
  id: string;
  memberId?: string; // Optional: Link to a member
  memberName: string; // Keep for display if memberId not fully implemented
  amount: number;
  date: string; // ISO string
  type: PaymentType;
  status: PaymentStatus;
  description: string;
  reference?: string; // Optional payment reference
}

const PaymentTracker = () => {
  const [payments, setPayments] = useState<Payment[]>([
    { id: generateId(), memberName: "Aisha Wanjala", amount: 2500, date: "2024-07-15", type: 'contribution', status: 'completed', description: "July Contribution", reference: "MPESA_JULY_001" },
    { id: generateId(), memberName: "Brian Kipchoge", amount: 15000, date: "2024-07-14", type: 'loan_disbursement', status: 'completed', description: "Emergency Loan", reference: "LN_BK_003" },
    { id: generateId(), memberName: "Chidinma Eze", amount: 2000, date: "2024-07-13", type: 'contribution', status: 'pending', description: "July Contribution (Bank Transfer)", reference: "BANK_TR_0713" },
    { id: generateId(), memberName: "David Mwangi", amount: 5000, date: "2024-07-12", type: 'loan_repayment', status: 'processing', description: "Loan Installment 1", reference: "LP_DM_001A" },
    { id: generateId(), memberName: "Aisha Wanjala", amount: 300, date: "2024-07-10", type: 'fine', status: 'completed', description: "Late Meeting Fine", reference: "FINE_AW_0710"},
    { id: generateId(), memberName: "Group Account", amount: 150, date: "2024-06-30", type: 'interest_earned', status: 'completed', description: "Bank Interest June", reference: "INT_JUN_24"},
  ]);

  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id' | 'date' | 'status'>>({
    memberName: "", amount: 0, type: 'contribution', description: "", reference: ""
  });

  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState({ type: "all", status: "all", searchTerm: "" });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Payment; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, formType: 'new' | 'edit') => {
    const { name, value } = e.target;
    const updatedValue = name === 'amount' ? parseFloat(value) || 0 : value;
    if (formType === 'new') {
      setNewPayment(prev => ({ ...prev, [name]: updatedValue }));
    } else if (editingPayment) {
      setEditingPayment(prev => prev ? { ...prev, [name]: updatedValue } : null);
    }
  };

  const handleSelectChange = (name: string, value: string, formType: 'new' | 'edit') => {
     if (formType === 'new') {
      setNewPayment(prev => ({ ...prev, [name]: value }));
    } else if (editingPayment) {
      setEditingPayment(prev => prev ? { ...prev, [name]: value as PaymentType | PaymentStatus } : null);
    }
  };

  const handleSubmit = (e: React.FormEvent, formType: 'new' | 'edit') => {
    e.preventDefault();
    if (formType === 'new') {
      if (newPayment.memberName && newPayment.amount > 0 && newPayment.type) {
        const paymentToAdd: Payment = {
          id: generateId(),
          ...newPayment,
          date: new Date().toISOString(),
          status: 'pending', // Default new payments to pending
        };
        setPayments(prev => [paymentToAdd, ...prev]);
        setNewPayment({ memberName: "", amount: 0, type: 'contribution', description: "", reference: "" });
        setIsAddModalOpen(false);
        toast({ title: "Payment Recorded", description: `Payment for ${paymentToAdd.memberName} is pending.`, variant: 'default' });
      }
    } else if (editingPayment) {
       setPayments(prev => prev.map(p => p.id === editingPayment.id ? editingPayment : p));
       setIsEditModalOpen(false);
       setEditingPayment(null);
       toast({ title: "Payment Updated", description: `Details for payment ID ${editingPayment.id} updated.`, variant: 'default' });
    }
  };

  const openEditModal = (payment: Payment) => {
    setEditingPayment({ ...payment });
    setIsEditModalOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    // Add confirmation dialog
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    toast({ title: "Payment Deleted", description: `Payment ID ${paymentId} removed.`, variant: 'destructive' });
  };

  const filteredAndSortedPayments = useMemo(() => {
    const items = payments.filter(p =>
      (filters.type === "all" || p.type === filters.type) &&
      (filters.status === "all" || p.status === filters.status) &&
      (p.memberName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
       p.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
       p.reference?.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    );
    if (sortConfig !== null) {
      items.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [payments, filters, sortConfig]);

  const requestSort = (key: keyof Payment) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Payment) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? '🔼' : '🔽';
  };

  const paymentTypeDetails: Record<PaymentType, { icon: ReactNode, color: string, label: string }> = {
    contribution: { icon: <TrendingUp className="h-4 w-4" />, color: "text-green-600 dark:text-green-400", label: "Contribution" },
    withdrawal: { icon: <CreditCard className="h-4 w-4" />, color: "text-blue-600 dark:text-blue-400", label: "Withdrawal" },
    loan_disbursement: { icon: <DollarSign className="h-4 w-4" />, color: "text-purple-600 dark:text-purple-400", label: "Loan Disbursement" },
    loan_repayment: { icon: <DollarSign className="h-4 w-4" />, color: "text-indigo-600 dark:text-indigo-400", label: "Loan Repayment" },
    fine: { icon: <AlertCircle className="h-4 w-4" />, color: "text-red-600 dark:text-red-400", label: "Fine" },
    interest_earned: { icon: <TrendingUp className="h-4 w-4" />, color: "text-yellow-600 dark:text-yellow-400", label: "Interest Earned" },
  };

  const paymentStatusDetails: Record<PaymentStatus, { icon: ReactNode, color: string, label: string }> = {
    completed: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600", label: "Completed" },
    pending: { icon: <ListFilter className="h-4 w-4" />, color: "text-yellow-600", label: "Pending" },
    processing: { icon: <ListFilter className="h-4 w-4 animate-pulse" />, color: "text-blue-500", label: "Processing" },
    failed: { icon: <XCircle className="h-4 w-4" />, color: "text-red-600", label: "Failed" },
  };

  const SummaryCard = ({ title, value, icon, colorClass, tooltip }: { title: string, value: string, icon: ReactNode, colorClass: string, tooltip: string }) => (
     <Tooltip>
        <TooltipTrigger asChild>
            <Card className={`${colorClass} text-white shadow-lg hover:scale-105 transition-transform`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                </CardContent>
            </Card>
        </TooltipTrigger>
        <TooltipContent><p>{tooltip}</p></TooltipContent>
    </Tooltip>
  );

  const totalContributions = useMemo(() => filteredAndSortedPayments.filter(p => p.type === 'contribution' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0), [filteredAndSortedPayments]);
  const totalWithdrawals = useMemo(() => filteredAndSortedPayments.filter(p => p.type === 'withdrawal' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0), [filteredAndSortedPayments]);
  const netBalance = totalContributions - totalWithdrawals;


  return (
    <Card className="shadow-xl border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Payment Tracker</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">Monitor and manage all financial transactions.</CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Record New Payment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="text-xl">Record New Payment</DialogTitle></DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, 'new')} className="grid gap-4 py-4">
                <FormRow label="Member Name" id="memberName-new"><Input name="memberName" value={newPayment.memberName} onChange={(e) => handleInputChange(e, 'new')} required /></FormRow>
                <FormRow label="Amount (KES)" id="amount-new"><Input name="amount" type="number" value={newPayment.amount.toString()} onChange={(e) => handleInputChange(e, 'new')} required /></FormRow>
                <FormRow label="Transaction Type" id="type-new">
                  <Select name="type" value={newPayment.type} onValueChange={(val) => handleSelectChange('type', val, 'new')}>
                    <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                    <SelectContent>{Object.entries(paymentTypeDetails).map(([key, details]) => <SelectItem key={key} value={key}>{details.label}</SelectItem>)}</SelectContent>
                  </Select>
                </FormRow>
                <FormRow label="Description" id="description-new"><textarea name="description" value={newPayment.description} onChange={(e) => handleInputChange(e, 'new')} className="col-span-3 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required /></FormRow>
                <FormRow label="Reference (Optional)" id="reference-new"><Input name="reference" value={newPayment.reference || ""} onChange={(e) => handleInputChange(e, 'new')} /></FormRow>
                <DialogFooter className="mt-2"><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit">Record Payment</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
         <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard title="Total Contributions" value={`KES ${formatCurrencyShort(totalContributions)}`} icon={<TrendingUp className="h-5 w-5 opacity-80" />} colorClass="bg-green-600" tooltip="Sum of all completed contributions." />
            <SummaryCard title="Total Withdrawals" value={`KES ${formatCurrencyShort(totalWithdrawals)}`} icon={<CreditCard className="h-5 w-5 opacity-80" />} colorClass="bg-blue-600" tooltip="Sum of all completed withdrawals." />
            <SummaryCard title="Net Balance" value={`KES ${formatCurrencyShort(netBalance)}`} icon={<DollarSign className="h-5 w-5 opacity-80" />} colorClass="bg-primary" tooltip="Current available funds (Contributions - Withdrawals)." />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
                <Input type="search" placeholder="Search by name, description, reference..." className="pl-10 w-full" value={filters.searchTerm} onChange={(e) => setFilters(f => ({...f, searchTerm: e.target.value}))} />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Select value={filters.type} onValueChange={(val) => setFilters(f => ({...f, type: val}))}>
                <SelectTrigger className="sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><span>Type: {paymentTypeDetails[filters.type as PaymentType]?.label || 'All'}</span></SelectTrigger>
                <SelectContent><SelectItem value="all">All Types</SelectItem>{Object.entries(paymentTypeDetails).map(([key, details]) => <SelectItem key={key} value={key}>{details.label}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(val) => setFilters(f => ({...f, status: val}))}>
                <SelectTrigger className="sm:w-[180px]"><ListFilter className="h-4 w-4 mr-2" /><span>Status: {paymentStatusDetails[filters.status as PaymentStatus]?.label || 'All'}</span></SelectTrigger>
                <SelectContent><SelectItem value="all">All Statuses</SelectItem>{Object.entries(paymentStatusDetails).map(([key, details]) => <SelectItem key={key} value={key}>{details.label}</SelectItem>)}</SelectContent>
            </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredAndSortedPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {/* Add more sortable columns as needed */}
                  <th className="p-3 text-left font-semibold cursor-pointer hover:bg-muted" onClick={() => requestSort('memberName')}>Member {getSortIndicator('memberName')}</th>
                  <th className="p-3 text-left font-semibold cursor-pointer hover:bg-muted" onClick={() => requestSort('amount')}>Amount {getSortIndicator('amount')}</th>
                  <th className="p-3 text-left font-semibold cursor-pointer hover:bg-muted" onClick={() => requestSort('type')}>Type {getSortIndicator('type')}</th>
                  <th className="p-3 text-left font-semibold cursor-pointer hover:bg-muted" onClick={() => requestSort('status')}>Status {getSortIndicator('status')}</th>
                  <th className="p-3 text-left font-semibold cursor-pointer hover:bg-muted" onClick={() => requestSort('date')}>Date {getSortIndicator('date')}</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-3">
                        <div className="font-medium text-foreground">{payment.memberName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={payment.description}>{payment.description}</div>
                    </td>
                    <td className={`p-3 font-semibold ${paymentTypeDetails[payment.type]?.color || 'text-foreground'}`}>KES {payment.amount.toLocaleString()}</td>
                    <td className="p-3">
                        <Tooltip>
                            <TooltipTrigger asChild><Badge variant="outline" className={`border-${paymentTypeDetails[payment.type]?.color.split('-')[1]}-500/50 ${paymentTypeDetails[payment.type]?.color.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-900/20')} flex items-center gap-1.5 capitalize`}>{paymentTypeDetails[payment.type].icon} {paymentTypeDetails[payment.type].label}</Badge></TooltipTrigger>
                            <TooltipContent><p>{paymentTypeDetails[payment.type].label}</p></TooltipContent>
                        </Tooltip>
                    </td>
                    <td className="p-3">
                        <Tooltip>
                            <TooltipTrigger asChild><Badge variant="outline" className={`border-${paymentStatusDetails[payment.status].color.split('-')[1]}-500/50 ${paymentStatusDetails[payment.status].color.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-900/20')} flex items-center gap-1.5 capitalize`}>{paymentStatusDetails[payment.status].icon} {paymentStatusDetails[payment.status].label}</Badge></TooltipTrigger>
                            <TooltipContent><p>{paymentStatusDetails[payment.status].label}</p></TooltipContent>
                        </Tooltip>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(payment.date).toLocaleDateString()} <span className="text-xs">{new Date(payment.date).toLocaleTimeString()}</span></td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => openEditModal(payment)} className="h-8 w-8"><Edit2 className="h-4 w-4 text-blue-500" /></Button></TooltipTrigger><TooltipContent>Edit Payment</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleDeletePayment(payment.id)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-500" /></Button></TooltipTrigger><TooltipContent>Delete Payment</TooltipContent></Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12"><DollarSign className="mx-auto h-12 w-12 text-muted-foreground" /><h3 className="mt-2 text-xl font-semibold">No Payments Found</h3><p className="mt-1 text-sm text-muted-foreground">Adjust filters or add a new payment.</p></div>
        )}
      </CardContent>
      {filteredAndSortedPayments.length > 0 && (
        <CardFooter className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Showing {filteredAndSortedPayments.length} of {payments.length} payments.</p>
        </CardFooter>
      )}

      {/* Edit Payment Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-xl">Edit Payment (ID: {editingPayment?.id.substring(0,5)})</DialogTitle></DialogHeader>
          {editingPayment && (
            <form onSubmit={(e) => handleSubmit(e, 'edit')} className="grid gap-4 py-4">
              <FormRow label="Member Name" id="memberName-edit"><Input name="memberName" value={editingPayment.memberName} onChange={(e) => handleInputChange(e, 'edit')} required /></FormRow>
              <FormRow label="Amount (KES)" id="amount-edit"><Input name="amount" type="number" value={editingPayment.amount.toString()} onChange={(e) => handleInputChange(e, 'edit')} required /></FormRow>
              <FormRow label="Transaction Type" id="type-edit">
                  <Select name="type" value={editingPayment.type} onValueChange={(val) => handleSelectChange('type', val, 'edit')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(paymentTypeDetails).map(([key, details]) => <SelectItem key={key} value={key}>{details.label}</SelectItem>)}</SelectContent>
                  </Select>
              </FormRow>
              <FormRow label="Status" id="status-edit">
                  <Select name="status" value={editingPayment.status} onValueChange={(val) => handleSelectChange('status', val, 'edit')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(paymentStatusDetails).map(([key, details]) => <SelectItem key={key} value={key}>{details.label}</SelectItem>)}</SelectContent>
                  </Select>
              </FormRow>
              <FormRow label="Description" id="description-edit"><textarea name="description" value={editingPayment.description} onChange={(e) => handleInputChange(e, 'edit')} className="col-span-3 min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required /></FormRow>
              <FormRow label="Reference (Optional)" id="reference-edit"><Input name="reference" value={editingPayment.reference || ""} onChange={(e) => handleInputChange(e, 'edit')} /></FormRow>
              <DialogFooter className="mt-2"><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit">Save Changes</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const FormRow = ({ label, id, children }: { label: string; id: string; children: ReactNode }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">{label}</Label>
    <div className="col-span-3">{children}</div>
  </div>
);

export default PaymentTracker;
