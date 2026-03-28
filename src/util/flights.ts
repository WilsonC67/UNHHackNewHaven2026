const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com";

const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
    "X-RapidAPI-Host": RAPIDAPI_HOST,
    "Content-Type": "application/json"
};

export async function searchSkyId(name: string): Promise<Airport[]> {
    let req = await fetch(`https://${RAPIDAPI_HOST}/api/v1/flights/searchAirport?query=${name}&locale=en-US`, {
        headers
    })

    return await req.json() as Airport[]
}

// Stop Here

export async function searchFlights(
    /**
     * origin's sky id
     */
    origin: string,
    /**
     * destinations's sky id
     */
    destination: string,
    adults: number = 1
): Promise<{
    cost: number,

}> {
    try {
        const response = await fetch(
            `https://${RAPIDAPI_HOST}/api/v2/flights/searchFlightsComplete`,
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