
export enum ViewState {
  HOME = 'HOME',
  ARCHIVE = 'ARCHIVE',
  BIO = 'BIO',
  TALES = 'TALES'
}

export interface AudioItem {
  id: number;
  titulo: string;
  autor: string;
  cantante: string;
  acordeonero: string;
  fecha_publicacion: string;
  anio: number;
  url_audio: string;
  descripcion: string;
}

export interface VideoItem {
  id: number;
  titulo: string;
  autor: string;
  interprete: string;
  anio: number;
  url_video: string;
  thumbnail_url?: string;
  descripcion?: string;
  fecha_publicacion: string;
}

export interface StoryItem {
  id: number;
  titulo: string;
  subtitulo: string;
  fecha: string;
  imagen: string;
  contenido: string;
  autor: string;
  audio_url?: string;
}

export interface Question {
  nombre_apellido: string;
  ciudad: string;
  pregunta: string;
  fecha_envio?: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
