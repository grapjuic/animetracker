'use client';
import { useEffect, useState } from 'react';

export type Category = 'completed' | 'inProgress' | 'dropped';

type Tracker = {
  completed: number[];
  inProgress: number[];
  dropped: number[];
  ratings: Record<number, number>;
};

const initialTracker: Tracker = {
  completed: [],
  inProgress: [],
  dropped: [],
  ratings: {},
};

export default function useAnimeTracker() {
  const [tracker, setTracker] = useState<Tracker>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('anime-tracker');
      return stored ? JSON.parse(stored) : initialTracker;
    }
    return initialTracker;
  });

  useEffect(() => {
    localStorage.setItem('anime-tracker', JSON.stringify(tracker));
  }, [tracker]);

  function addAnime(animeId: number, category: Category, rating: number) {
    setTracker(prev => {
      const updated: Tracker = {
        ...prev,
        ratings: { ...prev.ratings, [animeId]: rating },
        completed: prev.completed.filter(id => id !== animeId),
        inProgress: prev.inProgress.filter(id => id !== animeId),
        dropped: prev.dropped.filter(id => id !== animeId),
      };
      updated[category] = [...new Set([...updated[category], animeId])];
      return updated;
    });
  }

  function removeAnime(animeId: number, category: Category) {
    setTracker(prev => {
      const { [animeId]: _, ...restRatings } = prev.ratings;
      return {
        ...prev,
        [category]: prev[category].filter(id => id !== animeId),
        ratings: restRatings,
      };
    });
  }
  
  return { tracker, addAnime, removeAnime };
}
