export default async function AnimeDetail({ params }: { params: { id: string } }) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        title {
          romaji
        }
        description(asHtml: false)
        averageScore
        genres
        episodes
        coverImage {
          large
        }
      }
    }
  `;

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        id: parseInt(params.id),
      },
    }),
    cache: "no-store", // Prevent stale content
  });

  const { data } = await response.json();
  const anime = data.Media;

  return (
    <main className="min-h-screen bg-black text-white px-8 py-6">
      <a href="/" className="text-sm text-gray-400 hover:text-white underline mb-6 block">
        ← back to home
      </a>

      <div className="flex flex-col md:flex-row gap-8">
        {anime.coverImage?.large && (
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="max-w-xs h-auto object-cover rounded-lg shadow-md"
          />
        )}

        <div>
          <h1 className="text-3xl font-semibold mb-4">{anime.title.romaji}</h1>
          <p className="text-gray-300 mb-4 max-w-prose whitespace-pre-line">
            {anime.description}
          </p>
          <p className="mb-2">
            ⭐ <strong>Average Score:</strong> {anime.averageScore ?? "N/A"}
          </p>
          <p className="mb-2">
            🎬 <strong>Episodes:</strong> {anime.episodes ?? "TBD"}
          </p>
          <p className="mb-2">
            🎭 <strong>Genres:</strong> {anime.genres.join(", ")}
          </p>
        </div>
      </div>
    </main>
  );
}
