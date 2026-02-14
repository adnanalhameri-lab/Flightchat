// Type declaration for amadeus package
declare module 'amadeus' {
  interface AmadeusConfig {
    clientId: string
    clientSecret: string
    hostname?: string
  }

  class Amadeus {
    constructor(config: AmadeusConfig)
    
    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<any>
      }
      flightDestinations: {
        get(params: any): Promise<any>
      }
    }
  }

  export default Amadeus
}
