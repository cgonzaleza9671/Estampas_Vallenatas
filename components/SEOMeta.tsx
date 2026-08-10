import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteMeta {
  title: string;
  description: string;
}

const routeMetaMap: Record<string, RouteMeta> = {
  '/': {
    title: 'Estampas Vallenatas | Museo Digital del Folclor Vallenato',
    description: 'Explora Estampas Vallenatas, el museo digital definitivo de la música vallenata. Más de 100 joyas musicales y relatos legendarios recopilados por Álvaro González Pimienta.',
  },
  '/la-memoria-del-acordeon': {
    title: 'La Memoria del Acordeón | Catálogo Musical Vallenato',
    description: 'Descubre nuestra extensa colección de canciones vallenatas, separadas por ritmos: Paseo, Merengue, Son y Puya. Escucha a los más grandes intérpretes y compositores.',
  },
  '/relatos-legendarios': {
    title: 'Relatos Legendarios | Historias del Vallenato',
    description: 'Sumérgete en los relatos legendarios detrás de las grandes canciones del folclor vallenato. Conoce las anécdotas de Rafael Escalona, Luis Enrique Martínez y más.',
  },
  '/acerca-del-autor': {
    title: 'Acerca del Autor | Álvaro González Pimienta',
    description: 'Conoce la biografía de Álvaro González Pimienta, folclorista, investigador y guardián de la memoria vallenata, jurado en el Festival de la Leyenda Vallenata.',
  }
};

export const SEOMeta: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentMeta = routeMetaMap[location.pathname] || routeMetaMap['/'];
    
    // 1. Dynamic Title
    document.title = currentMeta.title;
    
    // 2. Dynamic Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentMeta.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', currentMeta.description);
      document.head.appendChild(metaDescription);
    }
    
    // Dynamic OG Tags (Optional but good)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', currentMeta.title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', currentMeta.description);
    
    // 3. Dynamic Canonical URL
    const canonicalUrl = `https://tusitio.com/#${location.pathname === '/' ? '' : location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalLink);
    }
  }, [location]);

  return null;
};
