// lib/fetchRecentAnime.ts

const query = `
  query {
    Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: POPULARITY_DESC, status: RELEASING, isAdult: false) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

export async function fetchRecentAnime() {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // (Optional) cache for 1 hour
  });

  const json = await response.json();
  return json.data.Page.media;
}
