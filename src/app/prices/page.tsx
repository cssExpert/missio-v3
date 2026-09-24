import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prices | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function PricesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /prices */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Prices | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
