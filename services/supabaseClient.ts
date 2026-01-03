
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Tiempo de vida de la caché: 24 horas (en milisegundos)
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Función simple para guardar datos en el navegador
 */
const setCache = (key: string, data: any) => {
  const cacheEntry = {
    timestamp: Date.now(),
    data: data
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
};

/**
 * Función simple para recuperar datos si no han pasado más de 24 horas
 */
const getCache = (key: string) => {
  const entry = localStorage.getItem(key);
  if (!entry) return null;

  const { timestamp, data } = JSON.parse(entry);
  if (Date.now() - timestamp > CACHE_TTL) {
    localStorage.removeItem(key); // Borrar si es vieja
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
    url_audio: dbItem.audio_url,
    descripcion: dbItem.descripcion || "Sin comentarios adicionales."
  };
};

const mapDatabaseVideo = (dbItem: any): VideoItem => {
  let anio = 0;
  if (dbItem.fecha) {
    const date = new Date(dbItem.fecha);
    anio = !isNaN(date.getTime()) ? date.getFullYear() : 0;
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo,
    autor: dbItem.autor || 'Autor Desconocido',
    interprete: dbItem.interprete || 'Intérprete Desconocido',
    anio: anio,
    url_video: dbItem.url_video || dbItem.video_url,
    thumbnail_url: dbItem.thumbnail_url,
    descripcion: dbItem.descripcion
  };
};

export const fetchAudios = async (): Promise<AudioItem[]> => {
  const cached = getCache('ev_all_audios');
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('Audios')
      .select('*')
      .order('fecha', { ascending: false });
      
    if (error) return [];
    const results = data.map(mapDatabaseAudio);
    setCache('ev_all_audios', results);
    return results;
  } catch (e) {
    return [];
  }
};

export const fetchRecentAudios = async (limit: number = 3): Promise<AudioItem[]> => {
  // Para los recientes, usamos la caché general y filtramos para ahorrar llamadas
  const allCached = getCache('ev_all_audios');
  if (allCached) return allCached.slice(0, limit);

  try {
    const { data, error } = await supabase
      .from('Audios')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(limit);
      
    if (error) return [];
    return data.map(mapDatabaseAudio);
  } catch (e) {
    return [];
  }
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  const cached = getCache('ev_all_videos');
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('Videos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) return [];
    const results = data.map(mapDatabaseVideo);
    setCache('ev_all_videos', results);
    return results;
  } catch (e) {
    return [];
  }
};

export const fetchRecentVideos = async (limit: number = 2): Promise<VideoItem[]> => {
  const allCached = getCache('ev_all_videos');
  if (allCached) return allCached.slice(0, limit);

  try {
    const { data, error } = await supabase
      .from('Videos')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data.map(mapDatabaseVideo);
  } catch (e) {
    return [];
  }
};

export const saveQuestion = async (question: Question): Promise<boolean> => {
  try {
    const payload = {
      nombre_apellido: question.nombre_apellido,
      ciudad: question.ciudad,
      pregunta: question.pregunta,
      fecha_envio: new Date().toISOString()
    };
    const { error } = await supabase.from('Preguntas').insert([payload]);
    return !error;
  } catch (e) {
    return false;
  }
};

export const fetchLatestAudio = async (): Promise<AudioItem | null> => {
    const allCached = getCache('ev_all_audios');
    if (allCached && allCached.length > 0) return allCached[0];

    try {
      const audios = await fetchRecentAudios(1);
      return audios.length > 0 ? audios[0] : null;
    } catch (e) {
      return null;
    }
}
