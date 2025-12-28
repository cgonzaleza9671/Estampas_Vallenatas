
export enum ViewState {
  HOME = 'HOME',
  ARCHIVE = 'ARCHIVE',
  BIO = 'BIO',
  LOCATIONS = 'LOCATIONS'
}

export interface AudioItem {
  id: number;
  titulo: string;
  autor: string;          // Direct from DB 'autor'
  acordeonero: string;    // Direct from DB 'acordeonero'
  fecha_publicacion: string; // Formatted date string from 'fecha'
  anio: number;           // Kept for sorting logic
  url_audio: string;      // Direct from DB 'audio_url'
  descripcion: string;    // Direct from DB 'descripcion'
}

export interface VideoItem {
  id: number;
  titulo: string;
  autor: string;      // Changed from 'canal' to 'autor'
  anio: number;       
  url_video: string;  
  thumbnail_url?: string; // Direct from DB 'thumbnail_url'
  descripcion?: string;
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
