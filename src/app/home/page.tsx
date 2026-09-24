import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /home */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Home | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
