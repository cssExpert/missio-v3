import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home 3 | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function Home3Page() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /home-3 */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Home 3 | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
