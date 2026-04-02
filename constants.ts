
import { AudioItem, VideoItem, StoryItem } from './types.ts';

export const FESTIVAL_DATE = new Date('2026-04-29T08:00:00');

export const HERO_GALLERY = [
  "https://i.imgur.com/H7JgO73.jpeg",
  "https://i.imgur.com/l4iOgsO.jpeg",
  "https://i.imgur.com/wDz7qUP.jpeg",
  "https://i.imgur.com/e39bXRu.jpeg",
  "https://i.imgur.com/MxktqOB.png"
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
    contenido: "Rafael Escalona Martínez no tocaba el acordeón, pero sus manos moldeaban la reality en forma de canciones. Fue el cronista más grande que ha parido la tierra del Cacique Upar. Sus composiciones eran periódicos cantados que relataban desde amores imposibles hasta las peripecias de los contrabandistas en la Alta Guajira. 'La Casa en el Aire' no es solo una metáfora de protección paterna, es el símbolo de la imaginación vallenata que desafía las leyes de la física para honrar el sentimiento. Escalona elevó el vallenato de los corrales a los palacios presidenciales, demostrando que la poesía de provincia tiene un lenguaje universal. Su legado es un mapa sonoro de una Colombia que ya no existe, pero que vive eternamente in cada nota de sus composiciones.",
    frases: [
      "El cronista del aire.",
      "Periódicos cantados.",
      "La poesía de provincia tiene un lenguaje universal.",
      "Manos que moldeaban la realidad."
    ]
  },
  {
    id: 3,
    titulo: "Leandro Díaz: Los Ojos del Alma",
    subtitulo: "La historia del compositor ciego que veía el mundo con la luz de su corazón y su acordeón.",
    fecha: "Marzo 2024",
    imagen: "https://i.imgur.com/H7JgO73.jpeg",
    autor: "Álvaro González Pimienta",
    contenido: "Leandro Díaz nació en las tierras del Magdalena, marcado por una ceguera que, lejos de ser una limitación, se convirtió en su mayor don. Desde niño, aprendió a escuchar el viento, el canto de los pájaros y el murmullo de los ríos, traduciendo esos sonidos en melodías inmortales.\n\nSu capacidad para describir paisajes que nunca vio con los ojos físicos asombró a propios y extraños. 'Matilde Lina', su musa eterna, fue inmortalizada en versos que describen la elegancia de su caminar y la belleza de su ser, demostrando que el amor no necesita de la vista para ser profundo.\n\nLa música de Leandro no era solo entretenimiento; era una crónica de la vida rural, de los amores imposibles y de la resiliencia del espíritu humano. Sus canciones se convirtieron en himnos que resonaban en cada rincón de la región, uniendo a la gente a través de la emoción pura.\n\nA pesar de las dificultades, Leandro nunca perdió su alegría. Su risa era tan contagiosa como sus ritmos, y su sabiduría se reflejaba en cada palabra que componía. Fue un maestro de la metáfora, capaz de encontrar belleza en lo más simple y cotidiano.\n\nEl duelo entre Leandro y otros juglares era siempre un espectáculo de ingenio. Sus piquerías eran famosas por la rapidez de su mente y la profundidad de sus versos, dejando claro que su visión interna era mucho más aguda que la de cualquier otro.\n\nCon el tiempo, Leandro se convirtió en un símbolo de la cultura vallenata. Su legado trasciende las notas musicales; es un testimonio de cómo el arte puede superar cualquier barrera física y llegar directamente al alma de quienes lo escuchan.\n\nSus hijos y nietos continuaron su camino, manteniendo viva la llama de su música. La dinastía Díaz es hoy un pilar fundamental del folclor, llevando el nombre de Leandro a los escenarios más importantes del mundo.\n\nCada vez que suena un acordeón interpretando una de sus obras, el espíritu de Leandro vuelve a caminar por las calles de su pueblo. Su voz, aunque ya no esté físicamente, sigue guiando a las nuevas generaciones de compositores.\n\nLa historia de Leandro Díaz es una lección de vida. Nos enseña que la verdadera visión no está en los ojos, sino en la capacidad de sentir y expresar la esencia de lo que nos rodea con honestidad y pasión.\n\nEn las noches de parranda, su nombre es invocado con respeto y admiración. Los juglares de hoy estudian sus letras como si fueran textos sagrados, buscando capturar aunque sea una fracción de su genialidad narrativa.\n\nLeandro Díaz, el hombre que veía con el alma, dejó una huella imborrable en el corazón de Colombia. Su música es un puente entre el pasado y el presente, una melodía que nunca dejará de sonar mientras exista un acordeón.\n\nHoy, su legado es preservado por instituciones y amantes del vallenato, asegurando que las futuras generaciones conozcan la historia del hombre que, en la oscuridad, encontró la luz más brillante de todas.",
    frases: [
      "Los ojos del alma.",
      "La verdadera visión no está en los ojos.",
      "El hombre que veía con el alma.",
      "Un puente entre el pasado y el presente."
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
