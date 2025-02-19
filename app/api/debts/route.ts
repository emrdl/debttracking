// app/api/debts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { debts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allDebts = await db.select().from(debts);
    return NextResponse.json(allDebts);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim() || !body.amount || !body.type?.trim() || !body.dueDate) {
      return NextResponse.json(
        { error: 'Lütfen tüm zorunlu alanları doldurun. İsim ve miktar boş olamaz.' },
        { status: 400 }
      );
    }

    // Validate amount is a valid number and greater than 0
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Miktar sıfırdan büyük geçerli bir sayı olmalıdır' },
        { status: 400 }
      );
    }

    // Validate date
    const dueDate = new Date(body.dueDate);
    if (isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid due date format' },
        { status: 400 }
      );
    }

    const newDebt = await db.insert(debts).values({
      name: body.name,
      amount: amount.toString(), // Convert to string for DECIMAL type
      type: body.type,
      dueDate: dueDate
    }).returning();

    return NextResponse.json(newDebt[0]);
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}