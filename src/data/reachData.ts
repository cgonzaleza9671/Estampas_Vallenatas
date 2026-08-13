export interface ReachCity {
  name: string;
}

export interface ReachCountry {
  name: string;
  isoCode: string;
  visitors: number;
  cities: ReachCity[];
}

export const reachData: ReachCountry[] = [
  {
    name: 'Colombia',
    isoCode: 'co',
    visitors: 870,
    cities: [
      { name: 'Apartadó' }, { name: 'Aracataca' }, { name: 'Arjona' }, { name: 'Armenia' }, { name: 'Ayapel' }, 
      { name: 'Barrancabermeja' }, { name: 'Barranquilla' }, { name: 'Bello' }, { name: 'Bogotá' }, { name: 'Bucaramanga' }, 
      { name: 'Cali' }, { name: 'Cartagena' }, { name: 'Caucasia' }, { name: 'Cereté' }, { name: 'Chía' }, 
      { name: 'Codazzi' }, { name: 'Cúcuta' }, { name: 'El Carmen de Bolívar' }, { name: 'Envigado' }, { name: 'Facatativá' }, 
      { name: 'Floridablanca' }, { name: 'Fonseca' }, { name: 'Fundación' }, { name: 'Fusagasugá' }, { name: 'Galapa' }, 
      { name: 'Ibagué' }, { name: 'Lorica' }, { name: 'Maicao' }, { name: 'Manizales' }, { name: 'Mariquita' }, 
      { name: 'Medellín' }, { name: 'Montería' }, { name: 'Neiva' }, { name: 'Pasto' }, { name: 'Pereira' }, 
      { name: 'Piedecuesta' }, { name: 'Pitalito' }, { name: 'Provincia de Cartagena' }, { name: 'Repelón' }, { name: 'Riohacha' }, 
      { name: 'San Gil' }, { name: 'San Juan del Cesar' }, { name: 'San Martín' }, { name: 'Sincelejo' }, { name: 'Soacha' }, 
      { name: 'Tabio' }, { name: 'Tenjo' }, { name: 'Tunja' }, { name: 'Turbaco' }, { name: 'Valledupar' }, 
      { name: 'Villanueva' }, { name: 'Villavicencio' }, { name: 'Yopal' }
    ]
  },
  {
    name: 'Estados Unidos',
    isoCode: 'us',
    visitors: 251,
    cities: [
      { name: 'Anaheim' }, { name: 'Ashburn' }, { name: 'Aspen' }, { name: 'Aventura' }, { name: 'Baton Rouge' }, 
      { name: 'Beckley' }, { name: 'Cape Coral' }, { name: 'Charlotte' }, { name: 'Cheyenne' }, { name: 'Chicago' }, 
      { name: 'Conway' }, { name: 'Coral Gables' }, { name: 'Council Bluffs' }, { name: 'Dallas' }, { name: 'Daytona Beach' }, 
      { name: 'Denver' }, { name: 'Duluth' }, { name: 'Flint Hill' }, { name: 'Forest City' }, { name: 'Fort Lauderdale' }, 
      { name: 'Fort Wayne' }, { name: 'Fort Worth' }, { name: 'Gallatin' }, { name: 'Grapevine' }, { name: 'Houston' }, 
      { name: 'Live Oak' }, { name: 'Los Angeles' }, { name: 'Miami' }, { name: 'Miami Beach' }, { name: 'Morton' }, 
      { name: 'New York' }, { name: 'North Fort Myers' }, { name: 'Oak Ridge' }, { name: 'Orlando' }, { name: 'Philadelphia' }, 
      { name: 'Phoenix' }, { name: 'Prineville' }, { name: 'San Diego' }, { name: 'San Jose' }, { name: 'San Luis Obispo' }, 
      { name: 'Santa Clara' }, { name: 'Seattle' }, { name: 'Springfield' }, { name: 'Suffolk' }, { name: 'Tampa' }, 
      { name: 'The Hammocks' }, { name: 'Westchester' }
    ]
  },
  {
    name: 'España',
    isoCode: 'es',
    visitors: 97,
    cities: [
      { name: 'A Coruña' }, { name: 'Alicante' }, { name: 'Badalona' }, { name: 'Barcelona' }, { name: 'Benidorm' }, 
      { name: 'Bilbao' }, { name: 'Cáceres' }, { name: 'Castelldefels' }, { name: 'Girona' }, { name: 'Las Palmas de Gran Canaria' }, 
      { name: 'Las Rozas de Madrid' }, { name: 'Madrid' }, { name: 'Málaga' }, { name: 'Murcia' }, { name: 'Palma' }, 
      { name: 'Pozuelo de Alarcón' }, { name: 'Valencia' }, { name: 'Zaragoza' }
    ]
  },
  {
    name: 'Alemania',
    isoCode: 'de',
    visitors: 17,
    cities: [
      { name: 'Butzbach' }, { name: 'Diepholz' }, { name: 'Fráncfort del Meno' }, { name: 'Memmingen' }, { name: 'Múnich' }, 
      { name: 'Núremberg' }, { name: 'Titisee-Neustadt' }
    ]
  },
  {
    name: 'Canadá',
    isoCode: 'ca',
    visitors: 4,
    cities: [
      { name: 'Calgary' }, { name: 'Lethbridge' }, { name: 'Montreal' }, { name: 'Saint-Jérôme' }
    ]
  },
  {
    name: 'China',
    isoCode: 'cn',
    visitors: 4,
    cities: [
      { name: 'Pekín' }
    ]
  },
  {
    name: 'Argentina',
    isoCode: 'ar',
    visitors: 3,
    cities: [
      { name: 'Córdoba' }, { name: 'General Rodríguez' }, { name: 'Lanús' }, { name: 'Salta' }
    ]
  },
  {
    name: 'México',
    isoCode: 'mx',
    visitors: 3,
    cities: [
      { name: 'Ciudad de México' }, { name: 'Saltillo' }
    ]
  },
  {
    name: 'Países Bajos',
    isoCode: 'nl',
    visitors: 3,
    cities: [
      { name: 'Groninga' }
    ]
  },
  {
    name: 'Suecia',
    isoCode: 'se',
    visitors: 3,
    cities: [
      { name: 'Åre' }, { name: 'Estocolmo' }, { name: 'Luleå' }
    ]
  },
  {
    name: 'Australia',
    isoCode: 'au',
    visitors: 2,
    cities: [
      { name: 'Brisbane' }, { name: 'Melbourne' }
    ]
  },
  {
    name: 'Chile',
    isoCode: 'cl',
    visitors: 2,
    cities: [
      { name: 'Santiago' }
    ]
  },
  {
    name: 'Francia',
    isoCode: 'fr',
    visitors: 2,
    cities: [
      { name: 'París' }
    ]
  },
  {
    name: 'Suiza',
    isoCode: 'ch',
    visitors: 2,
    cities: [
      { name: 'Bulle' }, { name: 'Chur' }, { name: 'Cologny' }, { name: 'Fiesch' }, { name: 'Ginebra' }, 
      { name: 'Langenthal' }, { name: 'Lucerna' }, { name: 'Lyss' }, { name: 'Meyrin' }, { name: 'Monthey' }, 
      { name: 'Schaffhausen' }, { name: 'Thun' }, { name: 'Zug' }, { name: 'Zúrich' }
    ]
  },
  {
    name: 'Reino Unido',
    isoCode: 'gb',
    visitors: 2,
    cities: [
      { name: 'Keighley' }
    ]
  },
  {
    name: 'Venezuela',
    isoCode: 've',
    visitors: 2,
    cities: [
      { name: 'Caracas' }, { name: 'Maracaibo' }
    ]
  },
  {
    name: 'Andorra',
    isoCode: 'ad',
    visitors: 1,
    cities: [
      { name: 'Andorra la Vieja' }
    ]
  },
  {
    name: 'Irlanda',
    isoCode: 'ie',
    visitors: 1,
    cities: [
      { name: 'Dublín' }
    ]
  },
  {
    name: 'Panamá',
    isoCode: 'pa',
    visitors: 1,
    cities: [
      { name: 'Ciudad de Panamá' }
    ]
  },
  {
    name: 'Polonia',
    isoCode: 'pl',
    visitors: 1,
    cities: [
      { name: 'Varsovia' }
    ]
  },
  {
    name: 'Rusia',
    isoCode: 'ru',
    visitors: 1,
    cities: [
      { name: 'Moscú' }
    ]
  }
];

export const reachStats = {
  totalCountries: reachData.length,
  totalCities: reachData.reduce((acc, country) => acc + country.cities.length, 0),
  totalVisitors: reachData.reduce((acc, country) => acc + country.visitors, 0)
};
