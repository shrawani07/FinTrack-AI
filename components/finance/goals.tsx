"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Target, Plus, CalendarDays, TrendingUp, Trash2 } from "lucide-react";
import { useFinance } from "@/lib/finance-context";
import { cn } from "@/lib/utils";

export function Goals() {
  const { state, addGoal, deleteGoal, updateGoal } = useFinance();
  const { goals } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [addAmount, setAddAmount] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;

    setIsSubmitting(true);
    
    await addGoal({
      name,
      target: parseFloat(target),
      current: parseFloat(current) || 0,
      deadline,
    });

    setName("");
    setTarget("");
    setCurrent("");
    setDeadline("");
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const handleAddToGoal = async (goalId: string) => {
    const amount = parseFloat(addAmount[goalId] || "0");
    if (amount > 0) {
      await updateGoal(goalId, amount);
      setAddAmount((prev) => ({ ...prev, [goalId]: "" }));
    }
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoal(id);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalTarget)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalSaved)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Create Savings Goal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="50000"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-current">Current Savings (optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="goal-current"
                    type="number"
                    placeholder="0"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Target Date</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </span>
                ) : (
                  "Create Goal"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <Card className="border-0 shadow-md col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              No goals yet. Create your first savings goal!
            </CardContent>
          </Card>
        ) : (
          goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            const isOnTrack = progress >= 50;

            return (
              <Card
                key={goal.id}
                className={cn(
                  "border-0 shadow-md hover:shadow-lg transition-all duration-300 group",
                  "animate-in fade-in slide-in-from-bottom"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {goal.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <CalendarDays className="h-3 w-3" />
                      Due: {goal.deadline}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progress
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          isOnTrack
                            ? "bg-accent/20 text-accent"
                            : "bg-chart-3/20 text-chart-3"
                        )}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Saved</p>
                      <p className="font-semibold text-accent">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(goal.current)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(remaining)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="Add amount"
                        value={addAmount[goal.id] || ""}
                        onChange={(e) =>
                          setAddAmount((prev) => ({
                            ...prev,
                            [goal.id]: e.target.value,
                          }))
                        }
                        className="pl-7 h-9"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToGoal(goal.id)}
                      disabled={!addAmount[goal.id]}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
