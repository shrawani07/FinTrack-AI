import { NextResponse } from 'next/server';
import { db, insights, patterns, categoryColors } from '@/lib/db';

export async function GET() {
  try {
    const transactions = db.transactions;
    const goals = db.goals;
    
    // Calculate stats
    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = db.monthlyData[db.monthlyData.length - 1]?.income || 52000;
    const totalBalance = monthlyIncome - totalSpending;
    const savingsRate = Math.round(((monthlyIncome - totalSpending) / monthlyIncome) * 100);
    
    // Category breakdown
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalSpending) * 100),
      fill: categoryColors[category],
    }));
    
    // Goals progress
    const totalGoalTarget = goals.reduce((sum, g) => sum + g.target, 0);
    const totalGoalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
    const goalsProgress = totalGoalTarget > 0 
      ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) 
      : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBalance,
          monthlySpending: totalSpending,
          monthlyIncome,
          savingsRate,
          goalsProgress,
        },
        categoryBreakdown,
        monthlyData: db.monthlyData,
        insights,
        patterns,
        recentTransactions: transactions.slice(0, 5),
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
