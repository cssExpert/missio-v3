import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /contact */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Contact | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
