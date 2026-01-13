
import { AudioItem, VideoItem } from './types.ts';

export const FESTIVAL_DATE = new Date('2026-04-29T08:00:00');

export const HERO_GALLERY = [
  "https://i.imgur.com/CyzoY4Y.jpeg",
  "https://i.imgur.com/egByYqx.jpeg",
  "https://i.imgur.com/RgqMXVB.jpeg",
  "https://i.imgur.com/wa2FZec.png"
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
  },
  {
    id: 2,
    titulo: "Matilde Lina",
    autor: "Leandro Díaz",
    cantante: "Alejandro Durán",
    acordeonero: "Toño Salas",
    fecha_publicacion: "1978",
    anio: 1978,
    url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    descripcion: "Compuesta a orillas del río Tocaimo."
  },
  {
    id: 3,
    titulo: "El Cantor de Fonseca",
    autor: "Carlos Huertas",
    cantante: "Carlos Huertas",
    acordeonero: "Carlos Huertas",
    fecha_publicacion: "1980",
    anio: 1980,
    url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    descripcion: "Un homenaje a la tierra de La Guajira."
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
    // Added missing fecha_publicacion property to satisfy VideoItem interface
    fecha_publicacion: "Mayo de 1995"
  },
  {
    id: 2,
    titulo: "Historia del Son",
    autor: "Telecaribe",
    interprete: "Historiadores Folclóricos",
    anio: 1988,
    url_video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url: "https://i.imgur.com/egByYqx.jpeg",
    descripcion: "Análisis rítmico del aire de Son.",
    // Added missing fecha_publicacion property to satisfy VideoItem interface
    fecha_publicacion: "Octubre de 1988"
  }
];
