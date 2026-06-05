"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Info,
  Lightbulb,
  TrendingUp,
  Brain,
  Calendar,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { useFinance } from "@/lib/finance-context";
import { cn } from "@/lib/utils";

const insightIcons: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  info: Info,
  tip: Lightbulb,
  success: TrendingUp,
};

const insightColors: Record<string, string> = {
  warning: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  info: "bg-primary/20 text-primary border-primary/30",
  tip: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  success: "bg-accent/20 text-accent border-accent/30",
};

const patternIcons = [Brain, Calendar, Utensils, ShoppingCart];

interface InsightsSectionProps {
  className?: string;
}

export function SmartInsights({ className }: InsightsSectionProps) {
  const { state } = useFinance();
  const { insights, isLoading } = state;

  if (isLoading) {
    return <InsightsSkeleton className={className} title="Smart Insights" />;
  }

  return (
    <Card className={cn("border-0 shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-chart-3" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {insights.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No insights available yet
            </div>
          ) : (
            insights.map((insight, index) => {
              const Icon = insightIcons[insight.type];
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-all duration-300 hover:scale-[1.02]",
                    insightColors[insight.type],
                    "animate-in fade-in slide-in-from-left"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{insight.message}</p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SpendingPatterns({ className }: InsightsSectionProps) {
  const { state } = useFinance();
  const { patterns, isLoading } = state;

  if (isLoading) {
    return <InsightsSkeleton className={className} title="Spending Patterns" />;
  }

  return (
    <Card className={cn("border-0 shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Spending Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {patterns.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No patterns detected yet
            </div>
          ) : (
            patterns.map((pattern, index) => {
              const Icon = patternIcons[index % patternIcons.length];
              return (
                <div
                  key={pattern.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-all duration-300 hover:bg-muted",
                    "animate-in fade-in slide-in-from-right"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">{pattern.pattern}</p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsSkeleton({ className, title }: { className?: string; title: string }) {
  return (
    <Card className={cn("border-0 shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
