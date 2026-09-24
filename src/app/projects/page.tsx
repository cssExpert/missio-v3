import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Missio',
  description: 'Missio.io: software for mission-driven organizations',
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /projects */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Projects | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
