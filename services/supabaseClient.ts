
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * OBTIENE LA FECHA ACTUAL EN FORMATO COLOMBIA (UTC-5)
 * Esto asegura que los estrenos ocurran a medianoche hora Colombia.
 */
const getColombiaDate = (): Date => {
  const now = new Date();
  // Ajuste manual simple para COT (UTC-5)
  // En una app de producción más compleja usaríamos Luxon o similar, 
  // pero para este caso basta con el offset.
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const colombiaOffset = -5;
  return new Date(utc + (3600000 * colombiaOffset));
};

const getColombiaISOString = (): string => {
  const coDate = getColombiaDate();
  return coDate.toISOString().split('T')[0]; // YYYY-MM-DD
};

/** 
 * ESTRATEGIA DE CACHÉ INTELIGENTE:
 * La clave de caché ahora incluye la fecha de hoy. 
 * Mañana, la clave será distinta y forzará una nueva descarga de Supabase automáticamente.
 */
const getSmartCacheKey = (base: string) => {
  return `${base}_${getColombiaISOString()}`;
};

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
  const cacheKey = getSmartCacheKey(`ev_audios_p${page}_v9`);
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  const from = page * limit;
  const to = from + limit - 1;
  const today = getColombiaISOString();

  // FILTRADO EN SERVIDOR: .lte('fecha', today)
  // Esto ahorra Egress al no descargar audios que aún no deben ser visibles.
  let { data, error } = await supabase
    .from('Audios')
    .select(AUDIO_LIST_COLUMNS)
    .lte('fecha', today)
    .order('fecha', { ascending: false })
    .range(from, to);
    
  if (error) {
    const fallback = await supabase
      .from('Audios')
      .select('*')
      .lte('fecha', today)
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
  const cacheKey = getSmartCacheKey('ev_all_videos_v9');
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const today = getColombiaISOString();

  let { data, error } = await supabase
    .from('Videos')
    .select(VIDEO_LIST_COLUMNS)
    .lte('fecha', today)
    .order('fecha', { ascending: false });

  if (error) {
    const fallback = await supabase
      .from('Videos')
      .select('*')
      .lte('fecha', today)
      .order('fecha', { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data) return [];
  const results = data.map(mapDatabaseVideo);
  setCache(cacheKey, results);
  return results;
};

export const fetchRecentAudios = async (limit: number = 3): Promise<AudioItem[]> => {
  const today = getColombiaISOString();
  let { data, error } = await supabase
    .from('Audios')
    .select(AUDIO_LIST_COLUMNS)
    .lte('fecha', today)
    .order('fecha', { ascending: false })
    .limit(limit);
    
  if (error) {
    const fallback = await supabase
      .from('Audios')
      .select('*')
      .lte('fecha', today)
      .order('fecha', { ascending: false })
      .limit(limit);
    data = fallback.data;
  }

  return data ? data.map(mapDatabaseAudio) : [];
};

export const fetchRecentVideos = async (limit: number = 2): Promise<VideoItem[]> => {
  const today = getColombiaISOString();
  let { data, error } = await supabase
    .from('Videos')
    .select(VIDEO_LIST_COLUMNS)
    .lte('fecha', today)
    .order('fecha', { ascending: false })
    .limit(limit);

  if (error) {
    const fallback = await supabase
      .from('Videos')
      .select('*')
      .lte('fecha', today)
      .order('fecha', { ascending: false })
      .limit(limit);
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
