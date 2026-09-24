import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play to Your Strengths and Supercharge Your Business | Missio',
  description: 'Are you passionate about design and interested in pursuing a career as a graphic designer? Graphic design is a dynamic field that combines creativity, technical skills, and a keen eye for aesthetics.',
};

export default function PostsSlugPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* TODO: build /posts/[slug] */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-ink/60">
          Play to Your Strengths and Supercharge Your Business | Missio — coming soon
        </p>
      </div>
    </main>
  );
}
