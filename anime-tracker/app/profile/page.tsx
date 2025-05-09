// pages/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAnimeTracker, { Category } from '@/lib/useAnimeTracker';
import { fetchAnimeById } from '@/lib/fetchAnimebyID';

// Dummy favorite characters — replace with real state or backend later
const favoriteCharacters = [
  { name: 'Levi Ackerman', image: '/levi.jpg' },
  { name: 'Gojo Satoru', image: '/gojo.jpg' },
  { name: 'Holo', image: '/holo.jpg' },
];

type Anime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

export default function ProfilePage() {
  const { tracker, removeAnime } = useAnimeTracker();
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showDropped, setShowDropped] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const ids = [
        ...tracker.completed,
        ...tracker.inProgress,
        ...tracker.dropped,
      ];
      const uniqueIds = Array.from(new Set(ids));
      const fetched: Anime[] = [];

      for (const id of uniqueIds) {
        const data = await fetchAnimeById(id);
        if (data) fetched.push(data);
      }

      setAllAnime(fetched);
    }
    load();
  }, [tracker]);

  const getAnimeByIds = (ids: number[]) =>
    allAnime.filter((anime) => ids.includes(anime.id));

  const completed = getAnimeByIds(tracker.completed);
  const inProgress = getAnimeByIds(tracker.inProgress);
  const dropped = getAnimeByIds(tracker.dropped);

  const renderList = (list: Anime[], category: Category) => (
    <div className="space-y-4 mt-2">
      {list.map(anime => (
        <Link
          key={anime.id}
          href={`/anime/${anime.id}`}
          className="flex items-center gap-6 hover:opacity-80"
        >
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-20 h-32 object-cover rounded-md"
          />
          <div>
            <p className="text-base font-semibold">{anime.title.romaji}</p>
            <p className="text-sm text-gray-400">Rating: {tracker.ratings?.[anime.id] ?? 'N/A'}/10</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-6 items-center">
          <img
            src="/placeholder.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border border-white"
          />
          <h2 className="text-2xl font-bold">@grapejuice</h2>
        </div>

        <div className="space-x-4">
          <Link href="/home" className="text-sm bg-white text-black px-3 py-1 rounded font-semibold hover:bg-gray-300">🏠 Home</Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-sm bg-white text-black px-3 py-1 rounded font-semibold hover:bg-gray-300"
          >
            🔍 Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">anime</h3>

          <button
            className="text-base font-medium mb-3 hover:underline"
            onClick={() => setShowCompleted(prev => !prev)}
          >
            {showCompleted ? '▼' : '▶'} completed
          </button>
          {showCompleted && renderList(completed, 'completed')}

          <button
            className="text-base font-medium mt-8 mb-3 hover:underline"
            onClick={() => setShowInProgress(prev => !prev)}
          >
            {showInProgress ? '▼' : '▶'} in progress
          </button>
          {showInProgress && renderList(inProgress, 'inProgress')}

          <button
            className="text-base font-medium mt-8 mb-3 hover:underline"
            onClick={() => setShowDropped(prev => !prev)}
          >
            {showDropped ? '▼' : '▶'} dropped
          </button>
          {showDropped && renderList(dropped, 'dropped')}
        </div>

        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">manga</h3>
          <p className="text-base font-medium mb-2">^completed</p>
          <p className="text-base text-gray-400 mb-6">(coming soon)</p>
          <p className="text-base font-medium mb-2">^in progress</p>
          <p className="text-base text-gray-400">(coming soon)</p>
        </div>

        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">favorite characters</h3>
          <div className="space-y-6">
            {favoriteCharacters.map((char, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={char.image} alt={char.name} className="w-16 h-16 rounded-full object-cover border border-gray-500" />
                <p className="text-base font-semibold">{char.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
