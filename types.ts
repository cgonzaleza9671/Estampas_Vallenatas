
export enum ViewState {
  HOME = 'HOME',
  ARCHIVE = 'ARCHIVE',
  BIO = 'BIO',
  LOCATIONS = 'LOCATIONS'
}

export interface AudioItem {
  id: number;
  titulo: string;
  autor: string;
  cantante: string;       // New field
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
  interprete: string;     // New field
  anio: number;       
  url_video: string;  
  thumbnail_url?: string;
  descripcion?: string;
  fecha_publicacion: string; // New field for formatted month/year
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