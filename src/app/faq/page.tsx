import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function FaqPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /faq */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          FAQ | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
