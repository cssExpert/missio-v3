import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function PostsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /posts */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Blog | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
