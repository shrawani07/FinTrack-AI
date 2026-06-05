"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { useFinance } from "@/lib/finance-context";
import { Category, CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Travel: Car,
  Shopping: ShoppingBag,
  Bills: FileText,
  Others: MoreHorizontal,
};

const categoryIconsList = [
  { value: "Food", label: "Food", icon: Utensils },
  { value: "Travel", label: "Travel", icon: Car },
  { value: "Shopping", label: "Shopping", icon: ShoppingBag },
  { value: "Bills", label: "Bills", icon: FileText },
  { value: "Others", label: "Others", icon: MoreHorizontal },
] as const;

export function Expenses() {
  const { state, addTransaction, deleteTransaction } = useFinance();
  const { transactions } = state;

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    setIsSubmitting(true);
    
    await addTransaction({
      amount: parseFloat(amount),
      category,
      date,
      note,
      type: "expense",
    });

    setAmount("");
    setNote("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Expense Form */}
        <Card className="border-0 shadow-md lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as Category)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryIconsList.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !amount}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                  </span>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">All Expenses</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(totalExpenses)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses yet. Add your first expense!
                </div>
              ) : (
                transactions.map((transaction, index) => {
                  const Icon = categoryIcons[transaction.category];
                  return (
                    <div
                      key={transaction.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg p-3 transition-all duration-300 hover:bg-muted/50 group",
                        "animate-in slide-in-from-right"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-full p-2",
                            transaction.category === "Food" && "bg-chart-1/20",
                            transaction.category === "Travel" && "bg-chart-2/20",
                            transaction.category === "Shopping" && "bg-chart-3/20",
                            transaction.category === "Bills" && "bg-chart-4/20",
                            transaction.category === "Others" && "bg-chart-5/20"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              transaction.category === "Food" && "text-chart-1",
                              transaction.category === "Travel" && "text-chart-2",
                              transaction.category === "Shopping" && "text-chart-3",
                              transaction.category === "Bills" && "text-chart-4",
                              transaction.category === "Others" && "text-chart-5"
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {transaction.note || transaction.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-destructive">
                          -
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(transaction.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
