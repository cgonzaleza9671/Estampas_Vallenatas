const fs = require('fs');

const rawCities = `Colombia,Bogota,530,500,802,5747,Ciudad reportada
Colombia,Valledupar,107,96,80,844,Ciudad reportada
Colombia,Barranquilla,98,83,59,552,Ciudad reportada
Spain,Madrid,87,82,191,1353,Ciudad reportada
Colombia,Medellin,71,61,43,400,Ciudad reportada
United States,Flint Hill,69,138,69,500,Ciudad reportada
United States,San Jose,45,87,42,309,Ciudad reportada
United States,Phoenix,32,61,29,217,Ciudad reportada
Colombia,Cali,31,23,20,159,Ciudad reportada
United States,Ashburn,19,19,3,75,Ciudad reportada
Colombia,Villavicencio,18,14,12,75,Ciudad reportada
Colombia,Cucuta,17,11,12,65,Ciudad reportada
Colombia,Manizales,13,9,9,52,Ciudad reportada
Colombia,Arjona,12,11,5,58,Ciudad reportada
Colombia,Bello,10,5,3,35,Ciudad reportada
Colombia,Monteria,9,7,4,34,Ciudad reportada
United States,Miami,9,7,4,40,Ciudad reportada
Colombia,Chia,7,7,1,34,Ciudad reportada
Colombia,Ibague,7,7,0,24,Ciudad reportada
United States,Aspen,7,7,0,26,Ciudad reportada
Colombia,Pasto,6,3,3,22,Ciudad reportada
Spain,Barcelona,6,2,15,72,Ciudad reportada
Colombia,Armenia,5,5,2,26,Ciudad reportada
Colombia,Bucaramanga,5,3,2,18,Ciudad reportada
Colombia,Pereira,5,4,2,19,Ciudad reportada
Spain,Valencia,5,1,36,144,Ciudad reportada
Colombia,Fusagasuga,4,2,2,17,Ciudad reportada
United States,Council Bluffs,4,4,0,16,Ciudad reportada
United States,New York,4,4,2,22,Ciudad reportada
Spain,A Coruna,4,0,4,24,Ciudad reportada
Spain,Murcia,4,1,4,26,Ciudad reportada
Spain,Zaragoza,4,1,7,44,Ciudad reportada
Austria,Vienna,4,4,0,14,Ciudad reportada
Colombia,Cartagena,3,2,6,38,Ciudad reportada
Colombia,Envigado,3,2,3,12,Ciudad reportada
Colombia,Fundacion,3,3,0,10,Ciudad reportada
Colombia,Sincelejo,3,3,1,12,Ciudad reportada
United States,Dallas,3,3,4,17,Ciudad reportada
United States,Houston,3,3,0,11,Ciudad reportada
Spain,Alicante,3,0,3,10,Ciudad reportada
Spain,Castelldefels,3,0,3,15,Ciudad reportada
Netherlands,Groningen,3,3,0,9,Ciudad reportada
Colombia,Floridablanca,2,1,0,6,Ciudad reportada
Colombia,Piedecuesta,2,2,1,12,Ciudad reportada
Colombia,San Juan del Cesar,2,2,1,28,Ciudad reportada
Colombia,Tenjo,2,1,60,304,Ciudad reportada
United States,Baton Rouge,2,2,0,8,Ciudad reportada
United States,Cheyenne,2,2,0,7,Ciudad reportada
United States,Fort Lauderdale,2,2,0,6,Ciudad reportada
United States,Fort Worth,2,2,1,8,Ciudad reportada
United States,Los Angeles,2,2,1,30,Ciudad reportada
United States,Mentor,2,2,0,6,Ciudad reportada
United States,Philadelphia,2,2,0,8,Ciudad reportada
Spain,Bilbao,2,0,2,4,Ciudad reportada
Spain,Cartagena Province,2,1,4,30,Ciudad reportada
Spain,Malaga,2,0,6,27,Ciudad reportada
Spain,Palma,2,0,3,11,Ciudad reportada
Germany,Frankfurt am Main,2,2,0,6,Ciudad reportada
Germany,Munich,2,2,5,149,Ciudad reportada
Netherlands,Amsterdam,2,2,1,8,Ciudad reportada
Canada,Calgary,2,2,3,27,Ciudad reportada
United Kingdom,Keighley,2,2,0,8,Ciudad reportada
Chile,Santiago,2,2,1,18,Ciudad reportada
India,New Delhi,2,2,0,9,Capital
New Zealand,Wellington,2,2,0,9,Capital
Colombia,Apartado,1,0,1,11,Ciudad reportada
Colombia,Aracataca,1,1,0,4,Ciudad reportada
Colombia,Ayapel,1,0,0,3,Ciudad reportada
Colombia,Barrancabermeja,1,1,0,14,Ciudad reportada
Colombia,Caucasia,1,1,0,3,Ciudad reportada
Colombia,Cerete,1,1,0,3,Ciudad reportada
Colombia,Codazzi,1,1,0,4,Ciudad reportada
Colombia,El Carmen de Bolivar,1,1,0,3,Ciudad reportada
Colombia,Facatativa,1,1,0,4,Ciudad reportada
Colombia,Fonseca,1,1,0,3,Ciudad reportada
Colombia,Galapa,1,1,0,4,Ciudad reportada
Colombia,Lorica,1,1,2,13,Ciudad reportada
Colombia,Maicao,1,1,0,3,Ciudad reportada
Colombia,Neiva,1,1,0,4,Ciudad reportada
Colombia,Pitalito,1,1,1,3,Ciudad reportada
Colombia,Repelon,1,1,0,4,Ciudad reportada
Colombia,Riohacha,1,0,1,6,Ciudad reportada
Colombia,San Gil,1,0,0,3,Ciudad reportada
Colombia,San Martin,1,1,1,4,Ciudad reportada
Colombia,Soacha,1,1,0,4,Ciudad reportada
Colombia,Tabio,1,0,2,7,Ciudad reportada
Colombia,Tunja,1,1,0,3,Ciudad reportada
Colombia,Turbaco,1,0,0,3,Ciudad reportada
Colombia,Villanueva,1,1,0,4,Ciudad reportada
Colombia,Yopal,1,1,1,5,Ciudad reportada
United States,Aventura,1,1,0,3,Ciudad reportada
United States,Beckley,1,1,0,4,Ciudad reportada
United States,Cape Coral,1,1,0,3,Ciudad reportada
United States,Charlotte,1,1,0,5,Ciudad reportada
United States,Chicago,1,1,1,7,Ciudad reportada
United States,Conway,1,1,0,3,Ciudad reportada
United States,Coral Gables,1,1,1,4,Ciudad reportada
United States,Daytona Beach,1,1,0,4,Ciudad reportada
United States,Denver,1,1,1,4,Ciudad reportada
United States,Duluth,1,1,0,3,Ciudad reportada
United States,Forest City,1,1,1,5,Ciudad reportada
United States,Fort Wayne,1,0,1,1,Ciudad reportada
United States,Gallatin,1,0,1,1,Ciudad reportada
United States,Glenview,1,1,0,4,Ciudad reportada
United States,Grapevine,1,1,0,3,Ciudad reportada
United States,Live Oak,1,1,0,3,Ciudad reportada
United States,Miami Beach,1,0,1,2,Ciudad reportada
United States,Morton,1,1,0,3,Ciudad reportada
United States,North Fort Myers,1,1,0,3,Ciudad reportada
United States,Oak Ridge,1,1,0,3,Ciudad reportada
United States,Prineville,1,1,0,4,Ciudad reportada
United States,San Diego,1,1,0,4,Ciudad reportada
United States,Santa Clara,1,1,0,4,Ciudad reportada
United States,Seattle,1,0,0,4,Ciudad reportada
United States,Springfield,1,1,1,4,Ciudad reportada
United States,Suffolk,1,1,0,3,Ciudad reportada
United States,Tampa,1,1,0,4,Ciudad reportada
United States,The Hammocks,1,1,1,11,Ciudad reportada
United States,Westchester,1,1,1,5,Ciudad reportada
Spain,Badalona,1,1,0,4,Ciudad reportada
Spain,Benidorm,1,0,1,3,Ciudad reportada
Spain,Caceres,1,1,0,4,Ciudad reportada
Spain,Cordoba,1,1,1,5,Ciudad reportada
Spain,Girona,1,1,3,26,Ciudad reportada
Spain,Las Palmas de Gran Canaria,1,0,0,2,Ciudad reportada
Spain,Las Rozas de Madrid,1,0,1,3,Ciudad reportada
Spain,Pozuelo de Alarcon,1,0,1,6,Ciudad reportada
Switzerland,Bulle,1,1,1,6,Ciudad reportada
Switzerland,Cologny,1,0,1,4,Ciudad reportada
Switzerland,Fiesch,1,0,2,7,Ciudad reportada
Switzerland,Langenthal,1,0,1,7,Ciudad reportada
Switzerland,Lucerne,1,0,1,3,Ciudad reportada
Switzerland,Monthey,1,0,2,4,Ciudad reportada
Switzerland,Thun,1,0,2,5,Ciudad reportada
Switzerland,Zug,1,0,2,7,Ciudad reportada
Switzerland,Zurich,1,0,2,9,Ciudad reportada
Germany,Butzbach,1,1,0,3,Ciudad reportada
Germany,Diepholz,1,1,0,4,Ciudad reportada
Germany,Nuremberg,1,1,0,3,Ciudad reportada
Germany,Titisee-Neustadt,1,1,0,4,Ciudad reportada
Australia,Blue Mountains,1,0,1,2,Ciudad reportada
Australia,Brisbane,1,1,0,3,Ciudad reportada
Australia,Melbourne,1,1,0,4,Ciudad reportada
Canada,Montreal,1,1,0,4,Ciudad reportada
Canada,Saint-Jerome,1,1,1,5,Ciudad reportada
Australia,Wagga Wagga,1,0,1,3,Ciudad reportada
Sweden,Are,1,1,0,3,Ciudad reportada
Venezuela,Caracas,1,1,0,5,Ciudad reportada
Sweden,Lulea,1,1,0,3,Ciudad reportada
Venezuela,Maracaibo,1,1,1,5,Ciudad reportada
Venezuela,Merida,1,1,0,3,Ciudad reportada
Sweden,Stockholm,1,1,0,3,Ciudad reportada
Argentina,General Rodriguez,1,1,1,5,Ciudad reportada
Argentina,Salta,1,1,1,4,Ciudad reportada
China,Chongqing,1,1,0,3,Ciudad reportada
Ireland,Dublin,1,1,0,4,Ciudad reportada
Mexico,Mexico City,1,1,2,7,Ciudad reportada
Italy,Milan,1,1,2,9,Ciudad reportada
Russia,Moscow,1,1,0,4,Ciudad reportada
Panama,Panama City,1,1,0,3,Ciudad reportada
Poland,Warsaw,1,1,0,4,Ciudad reportada
Andorra,Andorra la Vella,1,1,1,9,Capital
Colombia,Mariquita,0,0,0,2,Ciudad reportada
United States,Anaheim,0,0,0,2,Ciudad reportada
United States,Belle Isle,0,0,0,2,Ciudad reportada
United States,Orlando,0,0,0,2,Ciudad reportada
United States,San Luis Obispo,0,0,0,2,Ciudad reportada
Switzerland,Chur,0,0,0,2,Ciudad reportada
Switzerland,Geneva,0,0,0,2,Ciudad reportada
Switzerland,Lyss,0,0,0,5,Ciudad reportada
Switzerland,Meyrin,0,0,0,2,Ciudad reportada
Switzerland,Schaffhausen,0,0,0,4,Ciudad reportada
Germany,Memmingen,0,0,0,3,Ciudad reportada
Canada,Lethbridge,0,0,1,3,Ciudad reportada
Argentina,Lanus,0,0,0,3,Ciudad reportada
Mexico,Saltillo,0,0,0,2,Ciudad reportada
France,Paris,0,0,0,2,Ciudad reportada`;

const isoCodes = {
  "Colombia": "co", "United States": "us", "Spain": "es", "Germany": "de", "Netherlands": "nl",
  "China": "cn", "Austria": "at", "Canada": "ca", "Sweden": "se", "Argentina": "ar",
  "Mexico": "mx", "Switzerland": "ch", "Australia": "au", "Venezuela": "ve", "United Kingdom": "gb",
  "Chile": "cl", "India": "in", "New Zealand": "nz", "France": "fr", "Ireland": "ie",
  "Italy": "it", "Russia": "ru", "Panama": "pa", "Poland": "pl", "Andorra": "ad"
};

const translations = {
  "Colombia": "Colombia", "United States": "Estados Unidos", "Spain": "España",
  "Germany": "Alemania", "Netherlands": "Países Bajos", "China": "China",
  "Austria": "Austria", "Canada": "Canadá", "Sweden": "Suecia", "Argentina": "Argentina",
  "Mexico": "México", "Switzerland": "Suiza", "Australia": "Australia", "Venezuela": "Venezuela",
  "United Kingdom": "Reino Unido", "Chile": "Chile", "India": "India", "New Zealand": "Nueva Zelanda",
  "France": "Francia", "Ireland": "Irlanda", "Italy": "Italia", "Russia": "Rusia",
  "Panama": "Panamá", "Poland": "Polonia", "Andorra": "Andorra"
};

const countryVisitors = {
  "Colombia": 910, "United States": 255, "Spain": 97, "Germany": 17, "Netherlands": 5,
  "China": 5, "Austria": 4, "Canada": 4, "Sweden": 3, "Argentina": 3,
  "Mexico": 3, "Switzerland": 2, "Australia": 2, "Venezuela": 2, "United Kingdom": 2,
  "Chile": 2, "India": 2, "New Zealand": 2, "France": 2, "Ireland": 1,
  "Italy": 1, "Russia": 1, "Panama": 1, "Poland": 1, "Andorra": 1
};

const citiesMap = {};

rawCities.trim().split('\n').forEach(line => {
  const parts = line.split(',');
  if (parts.length >= 2) {
    const country = parts[0];
    const city = parts[1];
    if (!citiesMap[country]) citiesMap[country] = [];
    citiesMap[country].push({ name: city });
  }
});

let tsCode = "export interface ReachCity {\n  name: string;\n}\n\nexport interface ReachCountry {\n  name: string;\n  isoCode: string;\n  visitors: number;\n  cities: ReachCity[];\n}\n\nexport const reachData: ReachCountry[] = [\n";

for (const [enCountry, esCountry] of Object.entries(translations)) {
  const code = isoCodes[enCountry];
  const visitors = countryVisitors[enCountry] || 0;
  const cities = citiesMap[enCountry] || [];
  cities.sort((a, b) => a.name.localeCompare(b.name));
  
  const citiesStr = cities.map(c => "{ name: '" + c.name.replace(/'/g, "\\'") + "' }").join(', ');
  
  tsCode += "  {\n";
  tsCode += "    name: '" + esCountry + "',\n";
  tsCode += "    isoCode: '" + code + "',\n";
  tsCode += "    visitors: " + visitors + ",\n";
  tsCode += "    cities: [\n      " + citiesStr + "\n    ]\n";
  tsCode += "  },\n";
}

tsCode += "];\n\nexport const reachStats = {\n  totalCountries: 25,\n  totalCities: 177,\n  totalVisitors: 1328\n};\n";

fs.writeFileSync('src/data/reachData.ts', tsCode);
console.log('Done generating file');
