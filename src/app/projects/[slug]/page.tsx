import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Acceleration for a B2B SaaS Provider | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function ProjectsSlugPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /projects/[slug] */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Digital Acceleration for a B2B SaaS Provider | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
