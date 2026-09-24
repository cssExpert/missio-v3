import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'David Stone | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function TeamDavidStonePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /team/david-stone */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          David Stone | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
