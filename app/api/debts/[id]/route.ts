// app/api/debts/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { debts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const result = await db.delete(debts).where(eq(debts.id, id)).returning();
    
    if (!result.length) {
      return NextResponse.json(
        { error: 'Debt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedDebt: result[0] });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.amount || !body.type || !body.dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount is a valid number
    const amount = parseFloat(body.amount);
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Amount must be a valid number' },
        { status: 400 }
      );
    }

    const updatedDebt = await db
      .update(debts)
      .set({
        name: body.name,
        amount: amount.toString(), // Convert to string for DECIMAL type
        type: body.type,
        dueDate: new Date(body.dueDate)
      })
      .where(eq(debts.id, id))
      .returning();

    if (!updatedDebt.length) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDebt[0]);
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}