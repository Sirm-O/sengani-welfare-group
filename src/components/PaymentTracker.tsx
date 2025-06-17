
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, TrendingUp, CreditCard, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  memberName: string;
  amount: number;
  date: string;
  type: 'contribution' | 'withdrawal' | 'loan' | 'interest';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const PaymentTracker = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      memberName: "John Doe",
      amount: 200,
      date: "2024-06-15",
      type: 'contribution',
      status: 'completed',
      description: "Monthly contribution"
    },
    {
      id: 2,
      memberName: "Jane Smith",
      amount: 150,
      date: "2024-06-14",
      type: 'withdrawal',
      status: 'completed',
      description: "Emergency withdrawal"
    },
    {
      id: 3,
      memberName: "Mike Johnson",
      amount: 200,
      date: "2024-06-13",
      type: 'contribution',
      status: 'pending',
      description: "Monthly contribution"
    },
    {
      id: 4,
      memberName: "Sarah Wilson",
      amount: 500,
      date: "2024-06-12",
      type: 'loan',
      status: 'completed',
      description: "Personal loan"
    }
  ]);

  const [newPayment, setNewPayment] = useState({
    memberName: "",
    amount: "",
    type: "" as Payment['type'] | "",
    description: ""
  });

  const [filterType, setFilterType] = useState<string>("all");
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const { toast } = useToast();

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPayment.memberName && newPayment.amount && newPayment.type) {
      const payment: Payment = {
        id: payments.length + 1,
        memberName: newPayment.memberName,
        amount: parseFloat(newPayment.amount),
        date: new Date().toISOString().split('T')[0],
        type: newPayment.type,
        status: 'completed',
        description: newPayment.description || `${newPayment.type} transaction`
      };

      setPayments([payment, ...payments]);
      setNewPayment({ memberName: "", amount: "", type: "", description: "" });
      setIsAddingPayment(false);
      
      toast({
        title: "Payment recorded successfully!",
        description: `${payment.type} of $${payment.amount} has been recorded.`,
      });
    }
  };

  const filteredPayments = payments.filter(payment => 
    filterType === "all" || payment.type === filterType
  );

  const getTypeColor = (type: Payment['type']) => {
    switch (type) {
      case 'contribution': return 'bg-green-100 text-green-800';
      case 'withdrawal': return 'bg-blue-100 text-blue-800';
      case 'loan': return 'bg-purple-100 text-purple-800';
      case 'interest': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalContributions = payments
    .filter(p => p.type === 'contribution' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalWithdrawals = payments
    .filter(p => p.type === 'withdrawal' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Tracker</h2>
          <p className="text-gray-600">Monitor all financial transactions</p>
        </div>
        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Add a new payment transaction to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-member">Member Name</Label>
                <Input
                  id="payment-member"
                  placeholder="Enter member name"
                  value={newPayment.memberName}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, memberName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-amount">Amount</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-type">Transaction Type</Label>
                <Select onValueChange={(value) => setNewPayment(prev => ({ ...prev, type: value as Payment['type'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contribution">Contribution</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="interest">Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-description">Description</Label>
                <Input
                  id="payment-description"
                  placeholder="Enter description (optional)"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">Record Payment</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Contributions</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalContributions.toLocaleString()}</div>
            <p className="text-xs opacity-90">All time contributions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Withdrawals</CardTitle>
            <CreditCard className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
            <p className="text-xs opacity-90">All time withdrawals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Net Balance</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalContributions - totalWithdrawals).toLocaleString()}</div>
            <p className="text-xs opacity-90">Available funds</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Payments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All financial transactions in your welfare group</CardDescription>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="contribution">Contributions</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="loan">Loans</SelectItem>
                <SelectItem value="interest">Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {payment.type === 'contribution' && <TrendingUp className="h-5 w-5 text-green-600" />}
                    {payment.type === 'withdrawal' && <CreditCard className="h-5 w-5 text-blue-600" />}
                    {payment.type === 'loan' && <DollarSign className="h-5 w-5 text-purple-600" />}
                    {payment.type === 'interest' && <Calendar className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{payment.memberName}</h4>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {payment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg font-semibold">
                    {payment.type === 'contribution' ? '+' : '-'}${payment.amount.toLocaleString()}
                  </p>
                  <div className="flex space-x-2">
                    <Badge className={getTypeColor(payment.type)}>
                      {payment.type}
                    </Badge>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracker;
