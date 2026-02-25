'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';

const emptyStats = { totalLeads: 0, qualifiedLeads: 0, wonThisMonth: 0, tasksDueToday: 0 };

export default function DashboardPage() {
  const [stats, setStats] = useState(emptyStats);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(emptyStats));
  }, []);

  const cards = [
    ['Total leads', stats.totalLeads],
    ['Qualified leads', stats.qualifiedLeads],
    ['Won this month', stats.wonThisMonth],
    ['Tasks due today', stats.tasksDueToday]
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Quick CRM health check for today." />
      <section className="grid gap-3 px-4 md:grid-cols-2 md:px-0">
        {cards.map(([title, value]) => (
          <article key={title} className="card">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </section>
    </>
  );
}
