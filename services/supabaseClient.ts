import { createClient } from '@supabase/supabase-js';
import { AudioItem, VideoItem, Question } from '../types';
import { MOCK_AUDIOS, MOCK_VIDEOS } from '../constants';

const SUPABASE_URL = 'https://bptsqlqnllsgflwpbbru.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdHNxbHFubGxzZ2Zsd3BiYnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTM2OTcsImV4cCI6MjA4MjI4OTY5N30.42H85Q1YEIFCGL7EezsnqTYVBUbT9uUxWvu8dJoQUDo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to map DB Audio structure to Frontend AudioItem
const mapDatabaseAudio = (dbItem: any): AudioItem => {
  // Extract year for sorting
  let anio = 0;
  let fechaFormatted = "Fecha desconocida";
  
  if (dbItem.fecha) {
    const date = new Date(dbItem.fecha);
    if (!isNaN(date.getTime())) {
      anio = date.getFullYear();
      // Format: "12 de octubre de 2023"
      fechaFormatted = date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    } else {
       // Fallback for strings
       fechaFormatted = dbItem.fecha;
    }
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo,
    autor: dbItem.autor || 'Autor Desconocido',
    acordeonero: dbItem.acordeonero || 'Sin Acordeonero Registrado',
    fecha_publicacion: fechaFormatted,
    anio: anio,
    url_audio: dbItem.audio_url,
    descripcion: dbItem.descripcion || "Sin comentarios adicionales."
  };
};

// Helper for Videos
const mapDatabaseVideo = (dbItem: any): VideoItem => {
  let anio = 0;
  if (dbItem.fecha) {
    const date = new Date(dbItem.fecha);
    anio = !isNaN(date.getTime()) ? date.getFullYear() : 0;
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo,
    autor: dbItem.autor || dbItem.canal || 'Desconocido', // Map autor, fallback to canal if legacy data exists
    anio: anio,
    url_video: dbItem.url_video || dbItem.video_url,
    thumbnail_url: dbItem.thumbnail_url, // Map thumbnail
    descripcion: dbItem.descripcion
  };
};

export const fetchAudios = async (): Promise<AudioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Audios')
      .select('*')
      .order('fecha', { ascending: false });
      
    if (error) {
      console.error("Error fetching audios:", JSON.stringify(error, null, 2));
      // MOCK data adaptation if needed, but assuming DB works
      return [];
    }
    
    return data.map(mapDatabaseAudio);
  } catch (e) {
    console.error("Exception fetching audios:", e);
    return [];
  }
};

export const fetchRecentAudios = async (limit: number = 3): Promise<AudioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Audios')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching recent audios:", JSON.stringify(error, null, 2));
      return [];
    }
    
    return data.map(mapDatabaseAudio);
  } catch (e) {
    console.error("Exception fetching recent audios:", e);
    return [];
  }
};

export const fetchVideos = async (): Promise<VideoItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Videos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error("Error fetching videos:", JSON.stringify(error, null, 2));
      return MOCK_VIDEOS;
    }
    
    return data.map(mapDatabaseVideo);
  } catch (e) {
    console.error("Exception fetching videos:", e);
    return MOCK_VIDEOS;
  }
};

export const saveQuestion = async (question: Question): Promise<boolean> => {
  try {
    // Explicit mapping to match the database schema: public.Preguntas
    const payload = {
      nombre_apellido: question.nombre_apellido,
      ciudad: question.ciudad,
      pregunta: question.pregunta,
      fecha_envio: new Date().toISOString()
    };

    const { error } = await supabase
      .from('Preguntas')
      .insert([payload]);

    if (error) {
      console.error("Error saving question to Supabase:", JSON.stringify(error, null, 2));
      return false;
    }
    return true;
  } catch (e) {
    console.error("Exception saving question:", e);
    return false;
  }
};

export const fetchLatestAudio = async (): Promise<AudioItem | null> => {
    try {
      const audios = await fetchRecentAudios(1);
      return audios.length > 0 ? audios[0] : null;
    } catch (e) {
      console.error("Error fetching latest audio", e);
      return null;
    }
}