
import { AudioItem, VideoItem, StoryItem } from './types.ts';

export const FESTIVAL_DATE = new Date('2026-04-29T08:00:00');

export const HERO_GALLERY = [
  "https://i.imgur.com/H7JgO73.jpeg",
  "https://i.imgur.com/l4iOgsO.jpeg",
  "https://i.imgur.com/wDz7qUP.jpeg",
  "https://i.imgur.com/e39bXRu.jpeg"
];

export const LEGENDARY_TALES: StoryItem[] = [
  {
    id: 1,
    titulo: "La Gota Fría: El Duelo Infinito",
    subtitulo: "Crónica de la piquería que definió el honor vallenato entre Emiliano Zuleta y Lorenzo Morales.",
    fecha: "Enero 2024",
    imagen: "https://i.imgur.com/CyzoY4Y.jpeg",
    autor: "Álvaro González Pimienta",
    contenido: "La historia del vallenato no sería la misma sin la legendaria rivalidad entre Emiliano Zuleta Baquero y Lorenzo Morales. Todo comenzó en una parranda donde las notas del acordeón se convirtieron en dardos de ingenio. 'Acordate Moralito de aquel día, que estuviste en Urumita y no quisiste hacer parada', rezan los versos que recorrieron el mundo. Morales, conocido como 'El gran Moralito', era un hombre de una técnica exquisita, mientras que Zuleta poseía una fuerza narrativa inigualable. Este duelo no fue de armas, sino de versos y fuelles, una demostración de que en el Magdalena Grande, el honor se defiende cantando. A pesar de la dureza de las palabras en la canción, el tiempo reveló que debajo de la competencia existía un respeto profundo que solo los grandes maestros pueden comprender.",
    frases: [
      "El honor se defiende cantando.",
      "Un duelo no de armas, sino de versos.",
      "El respeto profundo bajo la competencia.",
      "Dardos de ingenio hechos melodía."
    ]
  },
  {
    id: 2,
    titulo: "Rafael Escalona: El Cronista del Aire",
    subtitulo: "Cómo un hombre sin acordeón logró capturar el alma de un pueblo entero.",
    fecha: "Febrero 2024",
    imagen: "https://i.imgur.com/cJhXAof.jpeg",
    autor: "Álvaro González Pimienta",
    contenido: "Rafael Escalona Martínez no tocaba el acordeón, pero sus manos moldeaban la realidad en forma de canciones. Fue el cronista más grande que ha parido la tierra del Cacique Upar. Sus composiciones eran periódicos cantados que relataban desde amores imposibles hasta las peripecias de los contrabandistas en la Alta Guajira. 'La Casa en el Aire' no es solo una metáfora de protección paterna, es el símbolo de la imaginación vallenata que desafía las leyes de la física para honrar el sentimiento. Escalona elevó el vallenato de los corrales a los palacios presidenciales, demostrando que la poesía de provincia tiene un lenguaje universal. Su legado es un mapa sonoro de una Colombia que ya no existe, pero que vive eternamente in cada nota de sus composiciones.",
    frases: [
      "El cronista del aire.",
      "Periódicos cantados.",
      "La poesía de provincia tiene un lenguaje universal.",
      "Manos que moldeaban la realidad."
    ]
  }
];

export const MOCK_AUDIOS: AudioItem[] = [
  {
    id: 1,
    titulo: "La Gota Fría (Versión Histórica)",
    autor: "Emiliano Zuleta",
    cantante: "Emiliano Zuleta",
    acordeonero: "Emiliano Zuleta",
    fecha_publicacion: "1985",
    anio: 1985,
    url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    descripcion: "Una interpretación magistral que revive la piquería eterna entre Zuleta y Morales."
  }
];

export const MOCK_VIDEOS: VideoItem[] = [
  {
    id: 1,
    titulo: "Parranda en el Patio de Pimienta",
    autor: "Canal Vallenato",
    interprete: "Varios Juglares",
    anio: 1995,
    url_video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_url: "https://i.imgur.com/CyzoY4Y.jpeg",
    descripcion: "Documento inédito de una parranda de tres días.",
    fecha_publicacion: "Mayo de 1995"
  }
];
