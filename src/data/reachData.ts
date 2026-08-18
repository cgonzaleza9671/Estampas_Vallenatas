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
    visitors: 910,
    cities: [
      { name: 'Apartado' }, { name: 'Aracataca' }, { name: 'Arjona' }, { name: 'Armenia' }, { name: 'Ayapel' }, { name: 'Barrancabermeja' }, { name: 'Barranquilla' }, { name: 'Bello' }, { name: 'Bogota' }, { name: 'Bucaramanga' }, { name: 'Cali' }, { name: 'Cartagena' }, { name: 'Caucasia' }, { name: 'Cerete' }, { name: 'Chia' }, { name: 'Codazzi' }, { name: 'Cucuta' }, { name: 'El Carmen de Bolivar' }, { name: 'Envigado' }, { name: 'Facatativa' }, { name: 'Floridablanca' }, { name: 'Fonseca' }, { name: 'Fundacion' }, { name: 'Fusagasuga' }, { name: 'Galapa' }, { name: 'Ibague' }, { name: 'Lorica' }, { name: 'Maicao' }, { name: 'Manizales' }, { name: 'Mariquita' }, { name: 'Medellin' }, { name: 'Monteria' }, { name: 'Neiva' }, { name: 'Pasto' }, { name: 'Pereira' }, { name: 'Piedecuesta' }, { name: 'Pitalito' }, { name: 'Repelon' }, { name: 'Riohacha' }, { name: 'San Gil' }, { name: 'San Juan del Cesar' }, { name: 'San Martin' }, { name: 'Sincelejo' }, { name: 'Soacha' }, { name: 'Tabio' }, { name: 'Tenjo' }, { name: 'Tunja' }, { name: 'Turbaco' }, { name: 'Valledupar' }, { name: 'Villanueva' }, { name: 'Villavicencio' }, { name: 'Yopal' }
    ]
  },
  {
    name: 'Estados Unidos',
    isoCode: 'us',
    visitors: 255,
    cities: [
      { name: 'Anaheim' }, { name: 'Ashburn' }, { name: 'Aspen' }, { name: 'Aventura' }, { name: 'Baton Rouge' }, { name: 'Beckley' }, { name: 'Belle Isle' }, { name: 'Cape Coral' }, { name: 'Charlotte' }, { name: 'Cheyenne' }, { name: 'Chicago' }, { name: 'Conway' }, { name: 'Coral Gables' }, { name: 'Council Bluffs' }, { name: 'Dallas' }, { name: 'Daytona Beach' }, { name: 'Denver' }, { name: 'Duluth' }, { name: 'Flint Hill' }, { name: 'Forest City' }, { name: 'Fort Lauderdale' }, { name: 'Fort Wayne' }, { name: 'Fort Worth' }, { name: 'Gallatin' }, { name: 'Glenview' }, { name: 'Grapevine' }, { name: 'Houston' }, { name: 'Live Oak' }, { name: 'Los Angeles' }, { name: 'Mentor' }, { name: 'Miami' }, { name: 'Miami Beach' }, { name: 'Morton' }, { name: 'New York' }, { name: 'North Fort Myers' }, { name: 'Oak Ridge' }, { name: 'Orlando' }, { name: 'Philadelphia' }, { name: 'Phoenix' }, { name: 'Prineville' }, { name: 'San Diego' }, { name: 'San Jose' }, { name: 'San Luis Obispo' }, { name: 'Santa Clara' }, { name: 'Seattle' }, { name: 'Springfield' }, { name: 'Suffolk' }, { name: 'Tampa' }, { name: 'The Hammocks' }, { name: 'Westchester' }
    ]
  },
  {
    name: 'España',
    isoCode: 'es',
    visitors: 97,
    cities: [
      { name: 'A Coruna' }, { name: 'Alicante' }, { name: 'Badalona' }, { name: 'Barcelona' }, { name: 'Benidorm' }, { name: 'Bilbao' }, { name: 'Caceres' }, { name: 'Cartagena Province' }, { name: 'Castelldefels' }, { name: 'Cordoba' }, { name: 'Girona' }, { name: 'Las Palmas de Gran Canaria' }, { name: 'Las Rozas de Madrid' }, { name: 'Madrid' }, { name: 'Malaga' }, { name: 'Murcia' }, { name: 'Palma' }, { name: 'Pozuelo de Alarcon' }, { name: 'Valencia' }, { name: 'Zaragoza' }
    ]
  },
  {
    name: 'Alemania',
    isoCode: 'de',
    visitors: 17,
    cities: [
      { name: 'Butzbach' }, { name: 'Diepholz' }, { name: 'Frankfurt am Main' }, { name: 'Memmingen' }, { name: 'Munich' }, { name: 'Nuremberg' }, { name: 'Titisee-Neustadt' }
    ]
  },
  {
    name: 'Países Bajos',
    isoCode: 'nl',
    visitors: 5,
    cities: [
      { name: 'Amsterdam' }, { name: 'Groningen' }
    ]
  },
  {
    name: 'China',
    isoCode: 'cn',
    visitors: 5,
    cities: [
      { name: 'Chongqing' }
    ]
  },
  {
    name: 'Austria',
    isoCode: 'at',
    visitors: 4,
    cities: [
      { name: 'Vienna' }
    ]
  },
  {
    name: 'Canadá',
    isoCode: 'ca',
    visitors: 4,
    cities: [
      { name: 'Calgary' }, { name: 'Lethbridge' }, { name: 'Montreal' }, { name: 'Saint-Jerome' }
    ]
  },
  {
    name: 'Suecia',
    isoCode: 'se',
    visitors: 3,
    cities: [
      { name: 'Are' }, { name: 'Lulea' }, { name: 'Stockholm' }
    ]
  },
  {
    name: 'Argentina',
    isoCode: 'ar',
    visitors: 3,
    cities: [
      { name: 'General Rodriguez' }, { name: 'Lanus' }, { name: 'Salta' }
    ]
  },
  {
    name: 'México',
    isoCode: 'mx',
    visitors: 3,
    cities: [
      { name: 'Mexico City' }, { name: 'Saltillo' }
    ]
  },
  {
    name: 'Suiza',
    isoCode: 'ch',
    visitors: 2,
    cities: [
      { name: 'Bulle' }, { name: 'Chur' }, { name: 'Cologny' }, { name: 'Fiesch' }, { name: 'Geneva' }, { name: 'Langenthal' }, { name: 'Lucerne' }, { name: 'Lyss' }, { name: 'Meyrin' }, { name: 'Monthey' }, { name: 'Schaffhausen' }, { name: 'Thun' }, { name: 'Zug' }, { name: 'Zurich' }
    ]
  },
  {
    name: 'Australia',
    isoCode: 'au',
    visitors: 2,
    cities: [
      { name: 'Blue Mountains' }, { name: 'Brisbane' }, { name: 'Melbourne' }, { name: 'Wagga Wagga' }
    ]
  },
  {
    name: 'Venezuela',
    isoCode: 've',
    visitors: 2,
    cities: [
      { name: 'Caracas' }, { name: 'Maracaibo' }, { name: 'Merida' }
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
    name: 'Chile',
    isoCode: 'cl',
    visitors: 2,
    cities: [
      { name: 'Santiago' }
    ]
  },
  {
    name: 'India',
    isoCode: 'in',
    visitors: 2,
    cities: [
      { name: 'New Delhi' }
    ]
  },
  {
    name: 'Nueva Zelanda',
    isoCode: 'nz',
    visitors: 2,
    cities: [
      { name: 'Wellington' }
    ]
  },
  {
    name: 'Francia',
    isoCode: 'fr',
    visitors: 2,
    cities: [
      { name: 'Paris' }
    ]
  },
  {
    name: 'Irlanda',
    isoCode: 'ie',
    visitors: 1,
    cities: [
      { name: 'Dublin' }
    ]
  },
  {
    name: 'Italia',
    isoCode: 'it',
    visitors: 1,
    cities: [
      { name: 'Milan' }
    ]
  },
  {
    name: 'Rusia',
    isoCode: 'ru',
    visitors: 1,
    cities: [
      { name: 'Moscow' }
    ]
  },
  {
    name: 'Panamá',
    isoCode: 'pa',
    visitors: 1,
    cities: [
      { name: 'Panama City' }
    ]
  },
  {
    name: 'Polonia',
    isoCode: 'pl',
    visitors: 1,
    cities: [
      { name: 'Warsaw' }
    ]
  },
  {
    name: 'Andorra',
    isoCode: 'ad',
    visitors: 1,
    cities: [
      { name: 'Andorra la Vella' }
    ]
  },
];

export const reachStats = {
  totalCountries: 25,
  totalCities: 177,
  totalVisitors: 1328
};
