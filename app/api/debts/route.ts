// app/api/debts/route.ts
import { NextResponse } from 'next/server';
import type { Debt } from 'types';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'debts.json');

async function readDebts(): Promise<Debt[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function GET() {
  const debts = await readDebts();
  return NextResponse.json(debts);
}

export async function POST(request: Request) {
  const body: Debt = await request.json();
  const debts = await readDebts();
  
  const status = body.status === 'active' || body.status === 'paid' ? body.status : 'active';
  const debtWithId: Debt = { ...body, id: uuidv4(), createdAt: new Date().toISOString(), status };
  
  debts.push(debtWithId);
  await fs.writeFile(filePath, JSON.stringify(debts, null, 2));
  return NextResponse.json(debtWithId);
}