import { fetchApartments, Apartment } from '@/lib/api';
import { Building2, Search, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let apartments: Apartment[] = [];
  let total = 0;
  let backendOnline = false;
  let errorMsg = '';

  try {
    const data = await fetchApartments({ limit: 10 });
    apartments = data.items;
    total = data.total;
    backendOnline = true;
  } catch (err: any) {
    backendOnline = false;
    errorMsg = err.message || 'Бэкенд пока не запущен';
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">Flat 999</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                Tracer Bullet
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-medium">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-600">
                {backendOnline ? 'Бэкенд активен (:3001)' : 'Ожидание бэкенда'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tracer Bullet Status Banner */}
        <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">
                Phase 1: Tracer Bullet — Сквозная интеграция проверена
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Успешно связаны все архитектурные уровни: NestJS REST API, Prisma ORM, база данных SQLite и Next.js 14 App Router с Tailwind CSS.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">Next.js 14 (App Router)</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">Tailwind CSS</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">NestJS 10</span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">Prisma + SQLite</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md">GraphQL 999.md Client Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-800">Квартиры в базе ({total})</h2>
            </div>
          </div>

          {apartments.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">База готова к сбору квартир</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                В следующем этапе (Phase 2) скрапер автоматически загрузит свежие квартиры по вашему фильтру прямо из GraphQL API 999.md.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {apartments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{apt.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{apt.city || 'Кишинёв'} {apt.district && `• ${apt.district}`}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900">{apt.priceEur.toLocaleString()} €</span>
                    {apt.pricePerMeterEur && (
                      <span className="block text-xs text-slate-400">{apt.pricePerMeterEur} €/м²</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
