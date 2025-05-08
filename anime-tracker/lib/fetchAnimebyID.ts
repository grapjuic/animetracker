export async function fetchAnimeById(id: number) {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji }
          coverImage { large }
        }
      }
    `;
  
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });
  
    const json = await res.json();
    return json.data.Media;
  }
  