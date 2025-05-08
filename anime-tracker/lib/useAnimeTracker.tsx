'use client';
import { useEffect, useState } from 'react';

type Category = 'completed' | 'inProgress' | 'dropped';

export default function useAnimeTracker() {
  const [tracker, setTracker] = useState<{
    completed: number[];
    inProgress: number[];
    dropped: number[];
    ratings: Record<number, number>;
  }>({
    completed: [],
    inProgress: [],
    dropped: [],
    ratings: {}
  });

  useEffect(() => {
    const saved = localStorage.getItem('anime-tracker');
    if (saved) setTracker(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('anime-tracker', JSON.stringify(tracker));
  }, [tracker]);

  function addAnime(id: number, category: Category, rating: number) {
    setTracker((prev) => {
      const updated = {
        completed: prev.completed.filter((x) => x !== id),
        inProgress: prev.inProgress.filter((x) => x !== id),
        dropped: prev.dropped.filter((x) => x !== id),
        ratings: { ...prev.ratings, [id]: rating }
      };
      updated[category].push(id);
      return updated;
    });
  }

  return { tracker, addAnime };
}
