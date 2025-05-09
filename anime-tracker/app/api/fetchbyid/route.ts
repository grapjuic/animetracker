// app/api/fetchById/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { id } = await req.json();

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

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } }),
  });

  const json = await response.json();
  return NextResponse.json(json.data.Media);
}
