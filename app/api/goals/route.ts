import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Goal } from '@/lib/types';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: db.goals,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, target, deadline, current = 0 } = body;
    
    if (!name || !target || !deadline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, target, deadline' },
        { status: 400 }
      );
    }
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      name,
      target: parseFloat(target),
      current: parseFloat(current),
      deadline,
      createdAt: new Date().toISOString(),
    };
    
    db.goals.push(newGoal);
    
    return NextResponse.json({
      success: true,
      data: newGoal,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
