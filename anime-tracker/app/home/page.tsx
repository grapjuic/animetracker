'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchRecentAnime } from '@/lib/fetchRecentAnime';

type Anime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

export default function HomePage() {
  const [recentAnime, setRecentAnime] = useState<Anime[]>([]);

  useEffect(() => {
    async function load() {
      const results = await fetchRecentAnime();
      setRecentAnime(results);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">my anime database</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">new animes</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {recentAnime.map(anime => (
            <Link key={anime.id} href={`/anime/${anime.id}`} className="flex-shrink-0">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="w-36 h-52 object-cover rounded-md hover:opacity-90"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
} 