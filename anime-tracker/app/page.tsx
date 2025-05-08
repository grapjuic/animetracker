import Link from "next/link";
import { fetchRecentAnime } from "@/lib/fetchRecentAnime";

export default async function HomePage() {
  const animeList = await fetchRecentAnime();

  return (
    <main className="min-h-screen bg-black text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-2">my anime database</h1>
      <h2 className="text-xl mb-6">new animes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {animeList.map((anime: any) => (
          <Link key={anime.id} href={`/anime/${anime.id}`}>
            <div className="text-center cursor-pointer hover:opacity-80 transition">
              {anime.coverImage?.large && (
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="max-w-xs h-auto object-cover mx-auto rounded-md shadow-md"
                />
              )}
              <p className="mt-2 lowercase">{anime.title.romaji}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute top-6 right-6">
        <a href="/profile">
          <div className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer" />
        </a>
      </div>
    </main>
  );
}
