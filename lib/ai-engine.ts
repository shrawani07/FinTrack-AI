import { Transaction, ChatMessage } from './types';
import { db } from './db';

interface AIContext {
  transactions: Transaction[];
  totalSpending: number;
  categoryBreakdown: Record<string, number>;
  topCategory: string;
  recentTransactions: Transaction[];
}

function buildContext(): AIContext {
  const transactions = db.transactions;
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryBreakdown = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';
  
  const recentTransactions = transactions.slice(0, 5);
  
  return {
    transactions,
    totalSpending,
    categoryBreakdown,
    topCategory,
    recentTransactions,
  };
}

const responseTemplates = {
  spending: [
    "Based on your recent transactions, you've spent ₹{totalSpending} this month. Your highest spending category is {topCategory} at ₹{topAmount}.",
    "Looking at your finances, I see you've been spending primarily on {topCategory}. This accounts for {percentage}% of your total expenses.",
    "Your spending this month totals ₹{totalSpending}. I noticed {topCategory} takes up the largest chunk of your budget.",
  ],
  overspending: [
    "I've noticed you're spending quite a bit on {topCategory}. Consider setting a budget limit to help manage this category better.",
    "Your {topCategory} expenses seem higher than usual. Would you like me to help you create a spending plan?",
    "Based on your patterns, you tend to overspend on {topCategory}. Here's a tip: try the 50/30/20 rule for budgeting.",
  ],
  goals: [
    "You're making great progress on your savings goals! Keep up the momentum and you'll reach your targets.",
    "Looking at your goals, I recommend prioritizing your Emergency Fund. It's important to have 3-6 months of expenses saved.",
    "Your goal progress is on track. Consider automating your savings to make it easier to reach your targets.",
  ],
  tips: [
    "Here's a money-saving tip: Try meal prepping on weekends to reduce your food expenses by up to 40%.",
    "Consider using the envelope budgeting method. Allocate specific amounts for each category and stick to them.",
    "Track your daily expenses for a week. Small purchases often add up more than we realize!",
    "Set up automatic transfers to your savings account right after payday. Pay yourself first!",
  ],
  greeting: [
    "I'm here to help you make smarter financial decisions. What would you like to know about your spending?",
    "Let me analyze your finances. Feel free to ask about your spending patterns, savings goals, or get personalized tips!",
  ],
};

function getRandomTemplate(templates: string[]): string {
  return templates[Math.floor(Math.random() * templates.length)];
}

function detectIntent(message: string): 'spending' | 'overspending' | 'goals' | 'tips' | 'greeting' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('spend') || lowerMessage.includes('expense') || lowerMessage.includes('month')) {
    return 'spending';
  }
  if (lowerMessage.includes('too much') || lowerMessage.includes('overspend') || lowerMessage.includes('reduce') || lowerMessage.includes('save')) {
    return 'overspending';
  }
  if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('track')) {
    return 'goals';
  }
  if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help') || lowerMessage.includes('suggest')) {
    return 'tips';
  }
  
  return 'spending'; // default to spending analysis
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function generateAIResponse(userMessage: string): Promise<string> {
  const context = buildContext();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage,
        context: context,
      }),
    });

    const data = await res.json();
    return data.reply;

  } catch (error) {
    // fallback to old logic if API fails
    console.log("AI API failed, using fallback");

    const intent = detectIntent(userMessage);

    const topCategoryAmount = context.categoryBreakdown[context.topCategory] || 0;
    const percentage = context.totalSpending > 0 
      ? Math.round((topCategoryAmount / context.totalSpending) * 100) 
      : 0;

    let template = getRandomTemplate(responseTemplates[intent]);

    template = template
      .replace('{totalSpending}', formatCurrency(context.totalSpending).replace('₹', ''))
      .replace('{topCategory}', context.topCategory)
      .replace('{topAmount}', formatCurrency(topCategoryAmount).replace('₹', ''))
      .replace('{percentage}', percentage.toString());

    return template;
  }
}

export function generateInsightResponse(transactions: Transaction[]): string {
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categoryBreakdown = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const [topCategory, topAmount] = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)[0] || ['None', 0];
  
  const percentage = Math.round((topAmount / totalSpending) * 100);
  
  return `Your total spending is ${formatCurrency(totalSpending)}. ${topCategory} is your biggest expense category at ${percentage}% of total spending. Consider setting a monthly budget for ${topCategory} to better manage your finances.`;
}
