import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const index = db.goals.findIndex(g => g.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    db.goals.splice(index, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const index = db.goals.findIndex(g => g.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // Handle adding funds
    if (body.addFunds) {
      const newCurrent = Math.min(
        db.goals[index].current + parseFloat(body.addFunds),
        db.goals[index].target
      );
      db.goals[index].current = newCurrent;
    } else {
      db.goals[index] = {
        ...db.goals[index],
        ...body,
      };
    }
    
    return NextResponse.json({
      success: true,
      data: db.goals[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}
