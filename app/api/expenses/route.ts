import { NextResponse } from 'next/server';
import { db, categoryColors } from '@/lib/db';
import { Transaction } from '@/lib/types';

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: db.transactions,
      meta: {
        total: db.transactions.length,
        categoryColors,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { amount, category, date, note, type = 'expense' } = body;
    
    if (!amount || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, category, date' },
        { status: 400 }
      );
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      date,
      note: note || '',
      type,
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock database
    db.transactions.unshift(newTransaction);
    
    return NextResponse.json({
      success: true,
      data: newTransaction,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
