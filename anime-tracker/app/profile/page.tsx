'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAnimeTracker from '@/lib/useAnimeTracker';
import { fetchAnimeById } from '@/lib/fetchAnimebyID';
import { searchAnime } from '@/lib/searchAnime';

type Anime = {
  id: number;
  title: { romaji: string };
  coverImage: { large: string };
};

export default function ProfilePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const { tracker } = useAnimeTracker();
  const [allAnime, setAllAnime] = useState<Anime[]>([]);


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
  

  async function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      const results = await searchAnime(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  const getAnimeByIds = (ids: number[]) =>
    allAnime.filter((anime) => ids.includes(anime.id));

  const completed = getAnimeByIds(tracker.completed);
  const inProgress = getAnimeByIds(tracker.inProgress);
  const dropped = getAnimeByIds(tracker.dropped);

  const renderAnimeList = (list: Anime[]) => (
    <div className="grid grid-cols-2 gap-4">
      {list.map((anime) => (
        <div key={anime.id}>
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="w-24 h-36 object-cover rounded-md"
          />
          <p className="mt-1 text-sm">{anime.title.romaji}</p>
          <p className="text-xs text-gray-400">
            Rating:{' '}
            {tracker.ratings?.[anime.id] ? `${tracker.ratings[anime.id]}/10` : 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white px-8 py-6 relative">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10">
        <img
          src="/placeholder.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-2 border border-white"
        />
        <h2 className="text-xl font-semibold">@grapejuice</h2>
      </div>

      {/* Search Button */}
      <div className="fixed top-6 right-6 z-[999]">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="bg-white text-black rounded-full px-3 py-1 text-sm font-semibold"
        >
          🔍 Search
        </button>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed top-20 right-6 bg-gray-900 border border-white p-4 rounded-md w-80 shadow-lg z-[9999]">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={handleSearchInput}
            className="w-full p-2 mb-4 bg-white text-black placeholder-gray-500 rounded"
            autoFocus
          />
          {searchResults.length > 0 ? (
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {searchResults.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="flex gap-3 items-center hover:bg-gray-800 p-2 rounded transition"
                >
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    className="w-12 h-16 rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{anime.title.romaji}</p>
                    <p className="text-xs text-gray-400">Click to view →</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No results</p>
          )}
        </div>
      )}

      {/* Anime Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        <div>
          <h3 className="text-lg font-bold mb-2">✔️ Completed</h3>
          {renderAnimeList(completed)}
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">📺 In Progress</h3>
          {renderAnimeList(inProgress)}
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">❌ Dropped</h3>
          {renderAnimeList(dropped)}
        </div>
      </div>
    </main>
  );
}
