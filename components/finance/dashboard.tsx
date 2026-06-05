"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Utensils,
  Car,
  ShoppingBag,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "@/lib/finance-context";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Travel: Car,
  Shopping: ShoppingBag,
  Bills: FileText,
  Others: MoreHorizontal,
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Dashboard() {
  const { state } = useFinance();
  const { transactions, goals, stats, categoryBreakdown, monthlyData, isLoading } = state;

  const currentSavings = goals.reduce((sum, g) => sum + g.current, 0);
  const savingsGoal = goals.reduce((sum, g) => sum + g.target, 0) || 50000;
  const savingsProgress = savingsGoal > 0 ? (currentSavings / savingsGoal) * 100 : 0;

  const recentTransactions = transactions.slice(0, 5);

  // Prepare pie chart data
  const pieData = categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-accent" />
              <span className="text-accent">+{stats.savingsRate}%</span> savings rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spending
            </CardTitle>
            <div className="rounded-full bg-destructive/10 p-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlySpending)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-destructive" />
              <span className="text-destructive">{transactions.length}</span> transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Progress
            </CardTitle>
            <div className="rounded-full bg-accent/10 p-2">
              <PiggyBank className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currentSavings)}
            </div>
            <div className="mt-2">
              <Progress value={savingsProgress} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {savingsProgress.toFixed(0)}% of {formatCurrency(savingsGoal)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Goals
            </CardTitle>
            <div className="rounded-full bg-chart-3/20 p-2">
              <ArrowUpRight className="h-4 w-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.goalsProgress}% overall progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Category Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`oklch(${COLORS[index % COLORS.length]})`}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No spending data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="spending"
                    fill="oklch(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Spending"
                  />
                  <Bar
                    dataKey="income"
                    fill="oklch(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                    name="Income"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet
              </div>
            ) : (
              recentTransactions.map((transaction, index) => {
                const Icon = categoryIcons[transaction.category];
                return (
                  <div
                    key={transaction.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg p-3 transition-all duration-300 hover:bg-muted/50",
                      "animate-in slide-in-from-left"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
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
                    <span className="font-semibold text-destructive">
                      -{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
