import { NextResponse } from "next/server";

interface PlaceResult {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  googleMapsUri?: string;
}

/**
 * Curated portfolio sample based on the production Google Places search route.
 *
 * Product goals:
 * - keep the Google API key server-side
 * - bias results toward Berlin
 * - sanitize and bound user input
 * - request only the fields the product actually uses
 * - degrade gracefully when no confident result exists
 */
export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places is not configured" },
      { status: 503 },
    );
  }

  const { query } = await request.json() as { query?: string };

  const cleanQuery = typeof query === "string"
    ? query
        .replace(/[\u0000-\u001F\u007F-\u009F<>&"']/g, "")
        .trim()
        .slice(0, 100)
    : "";

  if (cleanQuery.length < 2) {
    return NextResponse.json({ places: [] });
  }

  const queries = [
    `${cleanQuery}, Berlin, Germany`,
    cleanQuery,
  ];

  for (const textQuery of queries) {
    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": [
              "places.id",
              "places.displayName",
              "places.formattedAddress",
              "places.location",
              "places.rating",
              "places.googleMapsUri",
            ].join(","),
          },
          body: JSON.stringify({
            textQuery,
            languageCode: "he",
            regionCode: "DE",
            locationBias: {
              circle: {
                center: {
                  latitude: 52.52,
                  longitude: 13.405,
                },
                radius: 50_000,
              },
            },
          }),
        },
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json() as { places?: PlaceResult[] };

      if (data.places?.length) {
        return NextResponse.json(
          { places: data.places },
          {
            headers: {
              "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
            },
          },
        );
      }
    } catch {
      // Try the fallback query.
    }
  }

  return NextResponse.json({ places: [] });
}
