export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Period {
  id: string;
  name: string;
  description: string;
  years: string;
  image: string;
}

export interface Architect {
  id: string;
  name: string;
  bio: string;
  notableWorks: string[];
  image: string;
}

export interface Building {
  id: string;
  name: string;
  architect?: string;
  location: string;
  year: string;
  yearNum: number;
  style: string;
  description: string;
  image: string;
  periodId?: string;
  historicalContext?: string;
  styleCharacteristics?: string[];
  styleTimeline?: string;
  modelUrl?: string;
  galleryImages?: string[];
  hotspots?: Hotspot[];
}

export interface Hotspot {
  slot: string;
  position: string;
  normal: string;
  data: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
