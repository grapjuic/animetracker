export async function searchAnime(title: string) {
    const query = `
      query ($search: String) {
        Page(perPage: 5) {
          media(search: $search, type: ANIME) {
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
  
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { search: title } })
    });
  
    const json = await res.json();
    return json.data.Page.media;
  }

  