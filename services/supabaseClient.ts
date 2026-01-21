
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question, StoryItem } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CACHE_TTL = 30 * 60 * 1000; 

const getCacheKey = (base: string, limit: number, page: number) => `${base}_p${page}_l${limit}_v30`;

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) { /* silent */ }
};

const getCache = (key: string) => {
  const entry = localStorage.getItem(key);
  if (!entry) return null;
  try {
    const { timestamp, data } = JSON.parse(entry);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch (e) { return null; }
};

const mapAudio = (db: any): AudioItem => {
  const rawDate = db.fecha || db.published_at || "";
  let anio = db.anio || 0;
  let fechaLabel = "Colección Histórica";
  
  if (rawDate) {
    const d = new Date(rawDate.includes('T') ? rawDate : rawDate + 'T12:00:00');
    if (!isNaN(d.getTime())) {
      anio = anio || d.getFullYear();
      fechaLabel = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }

  return {
    id: db.id,
    titulo: (db.titulo || db.title || 'Sin Título').trim(),
    autor: (db.autor || db.author || 'Autor Desconocido').trim(),
    cantante: (db.cantante || db.singer || 'Voz Desconocida').trim(),
    acordeonero: (db.acordeonero || db.accordion || 'Sin Acordeonero').trim(),
    fecha_publicacion: fechaLabel,
    anio: anio,
    url_audio: db.audio_url || db.url_audio || db.url || db.audio || '',
    descripcion: db.descripcion || db.description || ""
  };
};

const mapVideo = (db: any): VideoItem => {
  const rawDate = db.fecha || "";
  let anio = db.anio || 0;
  let fechaLabel = "Registro Histórico";

  if (rawDate) {
    const d = new Date(rawDate.includes('T') ? rawDate : rawDate + 'T12:00:00');
    if (!isNaN(d.getTime())) {
      anio = anio || d.getFullYear();
      const month = d.toLocaleDateString('es-CO', { month: 'long' });
      fechaLabel = `${month.charAt(0).toUpperCase() + month.slice(1)} ${d.getFullYear()}`;
    }
  }

  let url = db.video_url || db.url_video || db.url || '';
  if (url && !url.startsWith('http')) {
    url = `${SUPABASE_URL}/storage/v1/object/public/Videos/${url}`;
  }

  return {
    id: db.id,
    titulo: (db.titulo || db.title || 'Sin Título').trim(),
    autor: (db.autor || db.author || 'Autor Desconocido').trim(),
    interprete: (db.interprete || db.interpreter || 'Intérprete Desconocido').trim(),
    anio: anio,
    url_video: url,
    thumbnail_url: db.thumbnail_url || db.poster || '',
    descripcion: db.descripcion || db.description || "",
    fecha_publicacion: fechaLabel
  };
};

export const fetchAudios = async (page: number = 0, limit: number = 15): Promise<AudioItem[]> => {
  const cacheKey = getCacheKey('audios', limit, page);
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }
  
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('Audios')
    .select('*')
    .order('fecha', { ascending: false })
    .range(from, to);

  if (error) return [];
  const items = data ? data.map(mapAudio) : [];
  if (page === 0 && items.length > 0) setCache(cacheKey, items);
  return items;
};

export const fetchVideos = async (page: number = 0, limit: number = 4): Promise<VideoItem[]> => {
  const cacheKey = getCacheKey('videos', limit, page);
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }
  
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('Videos')
    .select('*')
    .order('fecha', { ascending: false })
    .range(from, to);
    
  if (error) return [];
  const items = data ? data.map(mapVideo) : [];
  if (page === 0 && items.length > 0) setCache(cacheKey, items);
  return items;
};

export const fetchRelatos = async (): Promise<StoryItem[]> => {
  const cacheKey = getCacheKey('relatos', 100, 0);
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('Relatos')
    .select('*')
    .order('fecha_registro', { ascending: false });

  if (error) return [];
  const items = data ? data.map((db: any): StoryItem => {
    const d = new Date(db.fecha_registro || Date.now());
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    let imagen = db.imagen_relato || '';
    if (imagen && !imagen.startsWith('http')) {
      imagen = `${SUPABASE_URL}/storage/v1/object/public/Imagenes/${imagen}`;
    }

    let audio = db.relato_url || '';
    if (audio && !audio.startsWith('http')) {
      audio = `${SUPABASE_URL}/storage/v1/object/public/Audios/${audio}`;
    }

    return {
      id: db.id,
      titulo: db.titulo || 'Sin Título',
      subtitulo: db.subtitulo || '',
      fecha: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      imagen: imagen,
      contenido: db.texto || '',
      autor: "Álvaro González Pimienta",
      audio_url: audio
    };
  }) : [];
  
  if (items.length > 0) setCache(cacheKey, items);
  return items;
};

export const fetchLatestAudio = async (): Promise<AudioItem | null> => {
  const audios = await fetchAudios(0, 1);
  return audios.length > 0 ? audios[0] : null;
};

export const fetchRecentAudios = async (limit: number = 6): Promise<AudioItem[]> => {
  return fetchAudios(0, limit);
};

export const fetchRecentVideos = async (limit: number = 3): Promise<VideoItem[]> => {
  return fetchVideos(0, limit);
};

export const fetchAudioDescription = async (id: number): Promise<string> => {
  const { data } = await supabase.from('Audios').select('descripcion').eq('id', id).single();
  return data?.descripcion || "";
};

export const fetchVideoDescription = async (id: number): Promise<string> => {
  const { data } = await supabase.from('Videos').select('descripcion').eq('id', id).single();
  return data?.descripcion || "";
};

export const saveQuestion = async (question: Question): Promise<boolean> => {
  const { error } = await supabase.from('Preguntas').insert([{
    nombre_apellido: question.nombre_apellido,
    ciudad: question.ciudad,
    pregunta: question.pregunta,
    fecha_envio: new Date().toISOString()
  }]);
  return !error;
};
