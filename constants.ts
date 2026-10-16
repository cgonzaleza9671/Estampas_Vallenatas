
import { AudioItem, VideoItem, StoryItem } from './types.ts';

import { PRELOADED_LEGENDARY_TALES } from './data/legendaryTalesData.ts';

export const FESTIVAL_DATE = new Date('2026-04-29T08:00:00');

export const HERO_GALLERY = [
  "https://i.imgur.com/H7JgO73.jpeg",
  "https://i.imgur.com/l4iOgsO.jpeg",
  "https://i.imgur.com/wDz7qUP.jpeg",
  "https://i.imgur.com/e39bXRu.jpeg",
  "https://i.imgur.com/MxktqOB.png"
];

export const LEGENDARY_TALES: StoryItem[] = PRELOADED_LEGENDARY_TALES;

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
