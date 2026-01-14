
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CACHE_TTL = 24 * 60 * 60 * 1000;

/** 
 * ESTRATEGIA DE DISPONIBILIDAD:
 * Incluimos variaciones de nombres de columnas comunes para evitar errores 400.
 * Si alguna columna no existe, la consulta fallará, por lo que usamos un try/catch con fallback.
 */
const AUDIO_LIST_COLUMNS = 'id, titulo, autor, cantante, acordeonero, fecha, audio_url, url_audio';
const VIDEO_LIST_COLUMNS = 'id, titulo, autor, interprete, anio, fecha, thumbnail_url, video_url, url_video, url';

const setCache = (key: string, data: any) => {
  const cacheEntry = {
    timestamp: Date.now(),
    data: data
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
};

const getCache = (key: string) => {
  const entry = localStorage.getItem(key);
  if (!entry) return null;
  const { timestamp, data } = JSON.parse(entry);
  if (Date.now() - timestamp > CACHE_TTL) {
    localStorage.removeItem(key);
    return null;
  }
  return data;
};

const mapDatabaseAudio = (dbItem: any): AudioItem => {
  let anio = 0;
  let fechaFormatted = "Fecha desconocida";
  
  if (dbItem.fecha) {
    const date = new Date(dbItem.fecha);
    if (!isNaN(date.getTime())) {
      anio = date.getFullYear();
      fechaFormatted = date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    } else {
       fechaFormatted = dbItem.fecha;
    }
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo,
    autor: dbItem.autor || 'Autor Desconocido',
    cantante: dbItem.cantante || 'Cantante Desconocido',
    acordeonero: dbItem.acordeonero || 'Sin Acordeonero Registrado',
    fecha_publicacion: fechaFormatted,
    anio: anio,
    url_audio: dbItem.audio_url || dbItem.url_audio || '',
    descripcion: dbItem.descripcion || ""
  };
};

const mapDatabaseVideo = (dbItem: any): VideoItem => {
  let anio = 0;
  let fechaFormatted = "Fecha desconocida";
  
  if (dbItem.fecha) {
    const date = new Date(dbItem.fecha);
    if (!isNaN(date.getTime())) {
      anio = date.getFullYear();
      const month = date.toLocaleDateString('es-CO', { month: 'long' });
      fechaFormatted = `${month.charAt(0).toUpperCase() + month.slice(1)} ${anio}`;
    }
  }

  let rawUrl = dbItem.video_url || dbItem.url_video || dbItem.url || '';
  if (rawUrl && !rawUrl.startsWith('http')) {
    rawUrl = `${SUPABASE_URL}/storage/v1/object/public/Videos/${rawUrl}`;
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo,
    autor: dbItem.autor || 'Autor Desconocido',
    interprete: dbItem.interprete || 'Intérprete Desconocido',
    anio: anio,
    url_video: rawUrl,
    thumbnail_url: dbItem.thumbnail_url,
    descripcion: dbItem.descripcion || "",
    fecha_publicacion: fechaFormatted
  };
};

export const fetchAudios = async (page: number = 0, limit: number = 50): Promise<AudioItem[]> => {
  const cacheKey = `ev_audios_p${page}_v8`;
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  const from = page * limit;
  const to = from + limit - 1;

  // Intento 1: Columnas optimizadas
  let { data, error } = await supabase
    .from('Audios')
    .select(AUDIO_LIST_COLUMNS)
    .order('fecha', { ascending: false })
    .range(from, to);
    
  // Fallback: Si hay error (posiblemente por nombre de columna), pedimos todo (*)
  if (error) {
    const fallback = await supabase
      .from('Audios')
      .select('*')
      .order('fecha', { ascending: false })
      .range(from, to);
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data) return [];
  const results = data.map(mapDatabaseAudio);
  
  if (page === 0) setCache(cacheKey, results);
  return results;
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  const cached = getCache('ev_all_videos_v8');
  if (cached) return cached;

  // Intento 1: Columnas optimizadas
  let { data, error } = await supabase
    .from('Videos')
    .select(VIDEO_LIST_COLUMNS)
    .order('fecha', { ascending: false });

  // Fallback: Si hay error, pedimos todo (*)
  if (error) {
    const fallback = await supabase
      .from('Videos')
      .select('*')
      .order('fecha', { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data) return [];
  const results = data.map(mapDatabaseVideo);
  setCache('ev_all_videos_v8', results);
  return results;
};

export const fetchRecentAudios = async (limit: number = 3): Promise<AudioItem[]> => {
  let { data, error } = await supabase
    .from('Audios')
    .select(AUDIO_LIST_COLUMNS)
    .order('fecha', { ascending: false })
    .limit(limit);
    
  if (error) {
    const fallback = await supabase.from('Audios').select('*').order('fecha', { ascending: false }).limit(limit);
    data = fallback.data;
  }

  return data ? data.map(mapDatabaseAudio) : [];
};

export const fetchRecentVideos = async (limit: number = 2): Promise<VideoItem[]> => {
  let { data, error } = await supabase
    .from('Videos')
    .select(VIDEO_LIST_COLUMNS)
    .order('fecha', { ascending: false })
    .limit(limit);

  if (error) {
    const fallback = await supabase.from('Videos').select('*').order('fecha', { ascending: false }).limit(limit);
    data = fallback.data;
  }

  return data ? data.map(mapDatabaseVideo) : [];
};

export const fetchAudioDescription = async (id: number): Promise<string> => {
  const { data, error } = await supabase.from('Audios').select('descripcion').eq('id', id).single();
  return error ? "" : data.descripcion || "";
};

export const fetchVideoDescription = async (id: number): Promise<string> => {
  const { data, error } = await supabase.from('Videos').select('descripcion').eq('id', id).single();
  return error ? "" : data.descripcion || "";
};

export const saveQuestion = async (question: Question): Promise<boolean> => {
  const payload = {
    nombre_apellido: question.nombre_apellido,
    ciudad: question.ciudad,
    pregunta: question.pregunta,
    fecha_envio: new Date().toISOString()
  };
  const { error } = await supabase.from('Preguntas').insert([payload]);
  return !error;
};

export const fetchLatestAudio = async (): Promise<AudioItem | null> => {
  const audios = await fetchRecentAudios(1);
  return audios.length > 0 ? audios[0] : null;
}
