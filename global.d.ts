
namespace Weather {
    interface DayWeatherSummary {
        date: string;
        tempHigh: number;
        iconPhrase: string;
    }

    interface DailyForecast {
        Date: string;
        Temperature: {
            Maximum: {
                Value: number;
                Unit: string;
            };
        };
        Day: {
            IconPhrase: string;
        };
    }

    interface WeatherData {
        DailyForecasts: DailyForecast[];
    }

    interface WeatherLocation {
        PrimaryPostalCode: string,
        Region: {
            ID: string,
            LocalizedName: string,
            EnglishName: string
        },
        TimeZone: {
            Code: string
            NextOffsetChange: string,
            Name: string,
            GmtOffset: number,
            IsDaylightSaving: boolean
        },
        GeoPosition: {
            Latitude: number,
            Longitude: number
        },
        EnglishName: string,
        Key: string,
        Type: "City" | "PostalCode" | "PDI" | "LatLong",
        LocalizedName: string,
        Country: {
            ID: string,
            LocationName: string,
            EnglishName: string
        },
        ParentCity: {
            Key: string,
            LocalizedName: string,
            EnglishName: string
        },
        Details: {
            Key: string,
            StationCode: string,
            StationGmtOffset: number,
            BandMap: string,
            Climo: string,
            LocalRadar: string,
            MediaRegion: string,
            LocationStem: string
        }
    }

}

namespace Travel {
    export interface QuizAnswers {
        budget: 'budget' | 'moderate' | 'luxury'
        vibe: string
        travelStyle: string
        biggestFear: string
        preferredSeason: 'spring' | 'summer' | 'autumn' | 'winter'
    }

    export interface DayPlan {
        day: number
        morning: string
        afternoon: string
        evening: string
    }

    export interface Itinerary {
        destination: string
        tagline: string
        personalizedReason: string
        days: DayPlan[]
        hiddenGems: string[]
        beyondTheHorizon: string
        packingTips: string[]
    }

    interface SerpApiFlightLeg {
        departure_airport: { name: string; id: string; time: string }
        arrival_airport: { name: string; id: string; time: string }
        airline: string
        airline_logo: string
        flight_number: string
        duration: number
    }

    interface SerpApiItinerary {
        flights: SerpApiFlightLeg[]
        price: number
        total_duration: number
        airline_logo: string
        booking_token: string
    }

    interface SerpApiResponse {
        best_flights?: SerpApiItinerary[]
        other_flights?: SerpApiItinerary[]
        error?: string
    }

    interface FlightOffer {
        id: string
        price: number
        currency: string
        airline: string
        airlineLogo: string
        flightNumber: string
        departure: string
        arrival: string
        duration: string
        stops: number
        bookingToken: string
      }

      export interface ResolvedAirport {
        iata: string
        name: string
        city: string
      }
}
