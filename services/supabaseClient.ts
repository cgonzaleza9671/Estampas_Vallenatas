
import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types.ts';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CACHE_TTL = 24 * 60 * 60 * 1000;

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

// Restauramos a '*' para evitar errores de Schema Mismatch si faltan columnas
const AUDIO_COLUMNS = '*';
const VIDEO_COLUMNS = '*';

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
    descripcion: dbItem.descripcion || "Sin comentarios adicionales."
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
      // Formato: "Mes Año" (ej: Enero 2026)
      fechaFormatted = `${month.charAt(0).toUpperCase() + month.slice(1)} ${anio}`;
    }
  }

  // Buscamos la URL en cualquier columna posible
  let rawUrl = dbItem.video_url || dbItem.url_video || dbItem.url || '';
  
  // Si la URL es solo una ruta (no empieza con http), construimos la URL pública de Supabase
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
    descripcion: dbItem.descripcion,
    fecha_publicacion: fechaFormatted
  };
};

export const fetchAudios = async (page: number = 0, limit: number = 50): Promise<AudioItem[]> => {
  const cacheKey = `ev_audios_p${page}_v6`;
  if (page === 0) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const from = page * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('Audios')
      .select(AUDIO_COLUMNS)
      .order('fecha', { ascending: false })
      .range(from, to);
      
    if (error) {
      console.error("Error fetching audios:", error);
      return [];
    }
    const results = data.map(mapDatabaseAudio);
    
    if (page === 0) setCache(cacheKey, results);
    return results;
  } catch (e) {
    return [];
  }
};

export const fetchRecentAudios = async (limit: number = 3): Promise<AudioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Audios')
      .select(AUDIO_COLUMNS)
      .order('fecha', { ascending: false })
      .limit(limit);
      
    if (error) return [];
    return data.map(mapDatabaseAudio);
  } catch (e) {
    return [];
  }
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  const cached = getCache('ev_all_videos_v6');
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('Videos')
      .select(VIDEO_COLUMNS)
      .order('fecha', { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
    const results = data.map(mapDatabaseVideo);
    setCache('ev_all_videos_v6', results);
    return results;
  } catch (e) {
    return [];
  }
};

export const fetchRecentVideos = async (limit: number = 2): Promise<VideoItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Videos')
      .select(VIDEO_COLUMNS)
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
    try {
      const audios = await fetchRecentAudios(1);
      return audios.length > 0 ? audios[0] : null;
    } catch (e) {
      return null;
    }
}
