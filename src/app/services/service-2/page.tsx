import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Research & Insights | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function ServicesService2Page() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /services/service-2 */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Market Research & Insights | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
