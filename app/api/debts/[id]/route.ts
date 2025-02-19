// app/api/debts/[id]/route.ts
import { NextResponse } from 'next/server';
import type { Debt } from 'types';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'debts.json');

async function readDebts(): Promise<Debt[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const debts = await readDebts();
  const filtered = debts.filter(debt => debt.id !== params.id);
  
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updatedDebt: Debt = await request.json();
  const debts = await readDebts();
  
  const index = debts.findIndex(debt => debt.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
  }
  
  debts[index] = { ...debts[index], ...updatedDebt };
  await fs.writeFile(filePath, JSON.stringify(debts, null, 2));
  return NextResponse.json(debts[index]);
}