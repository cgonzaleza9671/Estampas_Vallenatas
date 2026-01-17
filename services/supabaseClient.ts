
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CACHE_TTL = 30 * 60 * 1000; 

/**
 * CACHÉ v26 - Optimización de rendimiento para producción
 */
const getCacheKey = (base: string) => `${base}_v26`;

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

export const fetchAudios = async (page: number = 0, limit: number = 24): Promise<AudioItem[]> => {
  const cacheKey = getCacheKey(`audios_p${page}`);
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('Audios')
    .select('*')
    .order('fecha', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching audios:", error);
    return [];
  }

  const items = data ? data.map(mapAudio) : [];
  if (page === 0 && items.length > 0) setCache(cacheKey, items);
  return items;
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  const cacheKey = getCacheKey('videos');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('Videos')
    .select('*')
    .order('fecha', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  const items = data ? data.map(mapVideo) : [];
  if (items.length > 0) setCache(cacheKey, items);
  return items;
};

export const fetchRecentAudios = async (limit: number = 6): Promise<AudioItem[]> => {
  // Para los recientes siempre traemos la primera página con el límite deseado
  return fetchAudios(0, limit);
};

export const fetchRecentVideos = async (limit: number = 3): Promise<VideoItem[]> => {
  const videos = await fetchVideos();
  return videos.slice(0, limit);
};

export const fetchLatestAudio = async (): Promise<AudioItem | null> => {
  const audios = await fetchRecentAudios(1);
  return audios.length > 0 ? audios[0] : null;
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
