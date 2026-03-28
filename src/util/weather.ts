
const ACCUWEATHERAPI_HOST = "dataservice.accuweather.com";

const rapidApiHeaders = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
    "X-RapidAPI-Host": ACCUWEATHERAPI_HOST,
};

// Step 1: Resolve an airport name or IATA code to a Sky Scrapper skyId
async function resolveSkyId(query: string): Promise<string> {
    const response = await fetch(
        `https://${ACCUWEATHERAPI_HOST}/api/v1/flights/searchAirport`,
        { headers: rapidApiHeaders, params: { query, locale: "en-US" } }
    );
    const results = response.data?.data;
    if (!results?.length) throw new Error(`No airport found for: ${query}`);
    return results[0].skyId as string;
}

interface SkyScrapeItinerary {
    id: string;
    price: { raw: number };
    legs: {
        durationInMinutes: number;
        stopCount: number;
        departure: string;
        arrival: string;
        carriers: { marketing: Array<{ name: string; alternateId: string }> };
    }[];
}

interface FlightRequestBody {
    originQuery: string;      // city name or IATA e.g. "New York" or "JFK"
    destinationQuery: string;
    departureDate: string;    // YYYY-MM-DD
    adults?: number;
}

export async function searchFlights(
    city_name: string,
    destination_name: string,
    adults: number = 2
): Promise<{}> {
    try {
        const { originQuery, destinationQuery, departureDate, adults = 1 } = req.body;

        if (!originQuery || !destinationQuery || !departureDate) {
            res.status(400).json({
                success: false,
                error: "originQuery, destinationQuery, and departureDate are required",
            });
            return;
        }

        // Step 1: Resolve skyIds in parallel
        const [originSkyId, destinationSkyId] = await Promise.all([
            resolveSkyId(originQuery),
            resolveSkyId(destinationQuery),
        ]);

        // Step 2: Search flights
        const response = await fetch(
            `https://${ACCUWEATHERAPI_HOST}/api/v2/flights/searchFlightsComplete`,
            {
                headers: rapidApiHeaders,
                params: {
                    originSkyId,
                    destinationSkyId,
                    date: departureDate,
                    adults,
                    currency: "USD",
                    market: "en-US",
                    countryCode: "US",
                },
            }
        );

        const itineraries: SkyScrapeItinerary[] =
            response.data?.data?.itineraries ?? [];

        const flights: FlightOffer[] = itineraries.slice(0, 5).map((it) => {
            const leg = it.legs[0];
            const carrier = leg.carriers.marketing[0];
            const hrs = Math.floor(leg.durationInMinutes / 60);
            const mins = leg.durationInMinutes % 60;

            return {
                id: it.id,
                price: it.price.raw.toString(),
                currency: "USD",
                airline: carrier?.name ?? "Unknown",
                flightNumber: carrier?.alternateId ?? "N/A",
                departure: leg.departure,
                arrival: leg.arrival,
                duration: `PT${hrs}H${mins}M`,
                stops: leg.stopCount,
            };
        });

        res.json({ success: true, data: flights });
    } catch (err) {
        console.error("Flights error:", err);
        // Graceful fallback so the UI doesn't break during the demo
        res.json({
            success: false,
            data: [],
            fallback: true,
            error: "Flight search unavailable — check Google Flights for options!",
        });
    }
} 