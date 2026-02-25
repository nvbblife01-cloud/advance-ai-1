import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const dayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const [{ count: totalLeads }, { count: qualifiedLeads }, { count: wonThisMonth }, { count: tasksDueToday }] =
    await Promise.all([
      supabaseServer.from('leads').select('*', { count: 'exact', head: true }),
      supabaseServer.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'Qualified'),
      supabaseServer.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'Won').gte('updated_at', monthStart),
      supabaseServer
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'todo')
        .gte('due_date', dayStart)
        .lt('due_date', dayEnd)
    ]);

  return NextResponse.json({
    totalLeads: totalLeads ?? 0,
    qualifiedLeads: qualifiedLeads ?? 0,
    wonThisMonth: wonThisMonth ?? 0,
    tasksDueToday: tasksDueToday ?? 0
  });
}
