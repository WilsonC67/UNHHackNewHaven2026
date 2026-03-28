declare global {
    interface Airport {
        presentation: {
            title: string,
            suggestionTitle: string,
            subtitle: string
        },
        navigation: {
            entityId: string,
            entityType: "CITY", // add others as needed
            localizedName: string,
            relevantFlightParams: {
                skyId: string,
                entityId: string,
                flightPlaceType: string,
                localizedName: string
            },
            relevantHotelParams: {
                entityId: string,
                flightPlaceType: string,
                localizedName: string
            }
        }
    }
    type a = string
}