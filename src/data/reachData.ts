export interface ReachCity {
  name: string;
}

export interface ReachCountry {
  name: string;
  englishName: string;
  isoCode: string;
  numericCode: string;
  visitors: number;
  cities: ReachCity[];
}

export const reachData: ReachCountry[] = [
  {
    name: 'Colombia',
    englishName: 'Colombia',
    isoCode: 'co',
    numericCode: '170',
    visitors: 910,
    cities: [
      { name: 'Bogota' },
      { name: 'Valledupar' },
      { name: 'Barranquilla' },
      { name: 'Medellin' },
      { name: 'Cali' },
      { name: 'Villavicencio' },
      { name: 'Cucuta' },
      { name: 'Manizales' },
      { name: 'Arjona' },
      { name: 'Bello' },
      { name: 'Monteria' },
      { name: 'Chia' },
      { name: 'Ibague' },
      { name: 'Pasto' },
      { name: 'Pereira' },
      { name: 'Armenia' },
      { name: 'Bucaramanga' },
      { name: 'Fusagasuga' },
      { name: 'Cartagena' },
      { name: 'Envigado' },
      { name: 'Fundacion' },
      { name: 'Sincelejo' },
      { name: 'Floridablanca' },
      { name: 'Piedecuesta' },
      { name: 'Riohacha' },
      { name: 'San Juan del Cesar' },
      { name: 'Tabio' },
      { name: 'Tenjo' },
      { name: 'Tunja' },
      { name: 'Apartado' },
      { name: 'Aracataca' },
      { name: 'Ayapel' },
      { name: 'Barrancabermeja' },
      { name: 'Caucasia' },
      { name: 'Cerete' },
      { name: 'Codazzi' },
      { name: 'El Carmen de Bolivar' },
      { name: 'Facatativa' },
      { name: 'Fonseca' },
      { name: 'Galapa' },
      { name: 'Lorica' },
      { name: 'Maicao' },
      { name: 'Neiva' },
      { name: 'Pitalito' },
      { name: 'Repelon' },
      { name: 'San Gil' },
      { name: 'San Martin' },
      { name: 'Soacha' },
      { name: 'Turbaco' },
      { name: 'Villanueva' },
      { name: 'Yopal' },
      { name: 'Mariquita' }
    ]
  },
  {
    name: 'Estados Unidos',
    englishName: 'United States of America',
    isoCode: 'us',
    numericCode: '840',
    visitors: 255,
    cities: [
      { name: 'Flint Hill' },
      { name: 'Phoenix' },
      { name: 'Ashburn' },
      { name: 'Miami' },
      { name: 'Aspen' },
      { name: 'Council Bluffs' },
      { name: 'New York' },
      { name: 'Dallas' },
      { name: 'Houston' },
      { name: 'Baton Rouge' },
      { name: 'Cheyenne' },
      { name: 'Fort Lauderdale' },
      { name: 'Fort Worth' },
      { name: 'Los Angeles' },
      { name: 'Mentor' },
      { name: 'Philadelphia' },
      { name: 'Aventura' },
      { name: 'Beckley' },
      { name: 'Boynton Beach' },
      { name: 'Cape Coral' },
      { name: 'Charlotte' },
      { name: 'Chicago' },
      { name: 'Conway' },
      { name: 'Coral Gables' },
      { name: 'Daytona Beach' },
      { name: 'Denver' },
      { name: 'Duluth' },
      { name: 'Forest City' },
      { name: 'Fort Wayne' },
      { name: 'Gallatin' },
      { name: 'Glenview' },
      { name: 'Grapevine' },
      { name: 'Live Oak' },
      { name: 'Miami Beach' },
      { name: 'Morton' },
      { name: 'North Fort Myers' },
      { name: 'Oak Ridge' },
      { name: 'Prineville' },
      { name: 'San Diego' },
      { name: 'Santa Clara' },
      { name: 'Seattle' },
      { name: 'Springfield' },
      { name: 'Suffolk' },
      { name: 'Tampa' },
      { name: 'The Hammocks' },
      { name: 'Westchester' },
      { name: 'Anaheim' },
      { name: 'Belle Isle' },
      { name: 'Berwick' },
      { name: 'Briar Creek' },
      { name: 'Orlando' },
      { name: 'San Luis Obispo' }
    ]
  },
  {
    name: 'España',
    englishName: 'Spain',
    isoCode: 'es',
    numericCode: '724',
    visitors: 97,
    cities: [
      { name: 'Madrid' },
      { name: 'Barcelona' },
      { name: 'A Coruna' },
      { name: 'Valencia' },
      { name: 'Murcia' },
      { name: 'Zaragoza' },
      { name: 'Alicante' },
      { name: 'Castelldefels' },
      { name: 'Bilbao' },
      { name: 'Cartagena Province' },
      { name: 'Malaga' },
      { name: 'Palma' },
      { name: 'Badalona' },
      { name: 'Benidorm' },
      { name: 'Caceres' },
      { name: 'Cordoba' },
      { name: 'Girona' },
      { name: 'Las Palmas de Gran Canaria' },
      { name: 'Las Rozas de Madrid' },
      { name: 'Pozuelo de Alarcon' },
      { name: 'Seville' }
    ]
  },
  {
    name: 'Alemania',
    englishName: 'Germany',
    isoCode: 'de',
    numericCode: '276',
    visitors: 17,
    cities: [
      { name: 'Frankfurt am Main' },
      { name: 'Muhlhausen' },
      { name: 'Munich' },
      { name: 'Butzbach' },
      { name: 'Diepholz' },
      { name: 'Nuremberg' },
      { name: 'Titisee-Neustadt' },
      { name: 'Memmingen' }
    ]
  },
  {
    name: 'China',
    englishName: 'China',
    isoCode: 'cn',
    numericCode: '156',
    visitors: 5,
    cities: [
      { name: 'Fuzhou' },
      { name: 'Chongqing' },
      { name: 'Xiamen' }
    ]
  },
  {
    name: 'Países Bajos',
    englishName: 'Netherlands',
    isoCode: 'nl',
    numericCode: '528',
    visitors: 5,
    cities: [
      { name: 'Amsterdam' },
      { name: 'Groningen' }
    ]
  },
  {
    name: 'India',
    englishName: 'India',
    isoCode: 'in',
    numericCode: '356',
    visitors: 2,
    cities: [
      { name: 'New Delhi' }
    ]
  },
  {
    name: 'Austria',
    englishName: 'Austria',
    isoCode: 'at',
    numericCode: '040',
    visitors: 4,
    cities: [
      { name: 'Vienna' }
    ]
  },
  {
    name: 'Canadá',
    englishName: 'Canada',
    isoCode: 'ca',
    numericCode: '124',
    visitors: 4,
    cities: [
      { name: 'Calgary' },
      { name: 'Montreal' },
      { name: 'Saint-Jerome' },
      { name: 'Lethbridge' }
    ]
  },
  {
    name: 'Argentina',
    englishName: 'Argentina',
    isoCode: 'ar',
    numericCode: '032',
    visitors: 3,
    cities: [
      { name: 'General Rodriguez' },
      { name: 'Rio Segundo' },
      { name: 'Salta' },
      { name: 'Lanus' }
    ]
  },
  {
    name: 'México',
    englishName: 'Mexico',
    isoCode: 'mx',
    numericCode: '484',
    visitors: 3,
    cities: [
      { name: 'Mexico City' },
      { name: 'Saltillo' }
    ]
  },
  {
    name: 'Nueva Zelanda',
    englishName: 'New Zealand',
    isoCode: 'nz',
    numericCode: '554',
    visitors: 2,
    cities: [
      { name: 'Wellington' }
    ]
  },
  {
    name: 'Suecia',
    englishName: 'Sweden',
    isoCode: 'se',
    numericCode: '752',
    visitors: 3,
    cities: [
      { name: 'Are' },
      { name: 'Lulea' },
      { name: 'Stockholm' }
    ]
  },
  {
    name: 'Australia',
    englishName: 'Australia',
    isoCode: 'au',
    numericCode: '036',
    visitors: 2,
    cities: [
      { name: 'Blue Mountains' },
      { name: 'Brisbane' },
      { name: 'Melbourne' },
      { name: 'Wagga Wagga' }
    ]
  },
  {
    name: 'Chile',
    englishName: 'Chile',
    isoCode: 'cl',
    numericCode: '152',
    visitors: 2,
    cities: [
      { name: 'Santiago' }
    ]
  },
  {
    name: 'Francia',
    englishName: 'France',
    isoCode: 'fr',
    numericCode: '250',
    visitors: 2,
    cities: [
      { name: 'Paris' }
    ]
  },
  {
    name: 'Suiza',
    englishName: 'Switzerland',
    isoCode: 'ch',
    numericCode: '756',
    visitors: 2,
    cities: [
      { name: 'Bulle' },
      { name: 'Cologny' },
      { name: 'Fiesch' },
      { name: 'Frauenfeld' },
      { name: 'Langenthal' },
      { name: 'Lucerne' },
      { name: 'Monthey' },
      { name: 'Thun' },
      { name: 'Zug' },
      { name: 'Zurich' },
      { name: 'Chur' },
      { name: 'Geneva' },
      { name: 'Lyss' },
      { name: 'Meyrin' },
      { name: 'Schaffhausen' }
    ]
  },
  {
    name: 'Reino Unido',
    englishName: 'United Kingdom',
    isoCode: 'gb',
    numericCode: '826',
    visitors: 2,
    cities: [
      { name: 'Keighley' }
    ]
  },
  {
    name: 'Venezuela',
    englishName: 'Venezuela',
    isoCode: 've',
    numericCode: '862',
    visitors: 2,
    cities: [
      { name: 'Caracas' },
      { name: 'Maracaibo' },
      { name: 'Merida' }
    ]
  },
  {
    name: 'Andorra',
    englishName: 'Andorra',
    isoCode: 'ad',
    numericCode: '020',
    visitors: 1,
    cities: [
      { name: 'Andorra la Vella' }
    ]
  },
  {
    name: 'Costa Rica',
    englishName: 'Costa Rica',
    isoCode: 'cr',
    numericCode: '188',
    visitors: 1,
    cities: [
      { name: 'San Jose' }
    ]
  },
  {
    name: 'Irlanda',
    englishName: 'Ireland',
    isoCode: 'ie',
    numericCode: '372',
    visitors: 1,
    cities: [
      { name: 'Dublin' }
    ]
  },
  {
    name: 'Italia',
    englishName: 'Italy',
    isoCode: 'it',
    numericCode: '380',
    visitors: 1,
    cities: [
      { name: 'Milan' }
    ]
  },
  {
    name: 'Lituania',
    englishName: 'Lithuania',
    isoCode: 'lt',
    numericCode: '440',
    visitors: 1,
    cities: [
      { name: 'Vilnius' }
    ]
  },
  {
    name: 'Panamá',
    englishName: 'Panama',
    isoCode: 'pa',
    numericCode: '591',
    visitors: 1,
    cities: [
      { name: 'Panama City' }
    ]
  },
  {
    name: 'Polonia',
    englishName: 'Poland',
    isoCode: 'pl',
    numericCode: '616',
    visitors: 1,
    cities: [
      { name: 'Warsaw' }
    ]
  },
  {
    name: 'Rusia',
    englishName: 'Russia',
    isoCode: 'ru',
    numericCode: '643',
    visitors: 1,
    cities: [
      { name: 'Moscow' }
    ]
  }
];

export const reachStats = {
  totalCountries: reachData.length,
  totalCities: reachData.reduce((acc, c) => acc + c.cities.length, 0),
  totalVisitors: reachData.reduce((acc, c) => acc + c.visitors, 0)
};
