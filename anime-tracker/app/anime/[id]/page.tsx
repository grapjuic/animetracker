'use client';

import { useEffect, useState } from 'react';
import useAnimeTracker from '@/lib/useAnimeTracker';

export default function AnimeDetail({ params }: { params: { id?: string } }) {
  const animeId = parseInt(params?.id ?? '0');
  const { tracker, addAnime } = useAnimeTracker();
  const [anime, setAnime] = useState<any>(null);
  const [selectedRating, setSelectedRating] = useState<number>(tracker.ratings?.[animeId] || 0);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnime() {
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title { romaji }
            description(asHtml: false)
            averageScore
            episodes
            genres
            coverImage { large }
          }
        }
      `;
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { id: animeId } }),
      });
      const json = await res.json();
      setAnime(json.data.Media);
    }

    fetchAnime();
  }, [animeId]);

  useEffect(() => {
    if (tracker.completed.includes(animeId)) setSelectedStatus('completed');
    else if (tracker.inProgress.includes(animeId)) setSelectedStatus('inProgress');
    else if (tracker.dropped.includes(animeId)) setSelectedStatus('dropped');
  }, [tracker, animeId]);

  const handleSave = (status: 'completed' | 'inProgress' | 'dropped') => {
    if (selectedRating < 1 || selectedRating > 10) {
      alert('Please choose a rating from 1 to 10.');
      return;
    }
    addAnime(animeId, status, selectedRating);
    setSelectedStatus(status);
    alert(`Saved to "${status}" with rating ${selectedRating}/10`);
  };

  if (!anime) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <a href="/" className="text-sm text-gray-400 hover:text-white underline mb-6 block">
        ← Back to Home
      </a>

      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={anime.coverImage.large}
          alt={anime.title.romaji}
          className="max-w-xs h-auto rounded-lg shadow-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{anime.title.romaji}</h1>

          <p className="text-gray-300 mb-4 whitespace-pre-line">{anime.description}</p>

          <p className="mb-2">⭐ <strong>Average Score:</strong> {anime.averageScore ?? 'N/A'}</p>
          <p className="mb-2">🎬 <strong>Episodes:</strong> {anime.episodes ?? 'TBD'}</p>
          <p className="mb-2">🎭 <strong>Genres:</strong> {anime.genres.join(', ')}</p>

          <div className="mt-6">
            <label className="block mb-1 text-sm">Your Rating (1–10):</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              className="bg-white text-black p-2 rounded"
            >
              <option value={0}>Select rating</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-4 flex-wrap">
            <button
              onClick={() => handleSave('completed')}
              className={`px-4 py-1 rounded ${selectedStatus === 'completed' ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              ✔️ Completed
            </button>
            <button
              onClick={() => handleSave('inProgress')}
              className={`px-4 py-1 rounded ${selectedStatus === 'inProgress' ? 'bg-yellow-500' : 'bg-gray-700'}`}
            >
              📺 In Progress
            </button>
            <button
              onClick={() => handleSave('dropped')}
              className={`px-4 py-1 rounded ${selectedStatus === 'dropped' ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              ❌ Dropped
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
