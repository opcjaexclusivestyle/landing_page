import { StaticImageData } from 'next/image';

export interface SectionConfig {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  gradientDirection: 'to-b' | 'to-t';
}

export const sectionsConfig: SectionConfig[] = [
  {
    id: 'curtains',
    title: 'Firany',
    description:
      'Klasyczna elegancja i niepowtarzalny charakter dla Twojego wnętrza.',
    image: '/images/Firany.jpg',
    link: '/firany',
    buttonText: 'ZOBACZ WIĘCEJ',
    gradientDirection: 'to-b',
  },
  {
    id: 'curtains2',
    title: 'Zasłony',
    description: 'Pełna prywatność i stylowy design w każdym pomieszczeniu.',
    image: '/images/kitchen.jpg',
    link: '/zaslony',
    buttonText: 'ZOBACZ KOLEKCJĘ',
    gradientDirection: 'to-t',
  },
  {
    id: 'bedding',
    title: 'Pościel',
    description: 'Komfort snu i elegancka oprawa Twojej sypialni.',
    image: '/images/posciel.png',
    link: '/posciel-premium',
    buttonText: 'ODKRYJ KOMFORT',
    gradientDirection: 'to-b',
  },
  {
    id: 'blinds',
    title: 'Rolety',
    description:
      'Nowoczesne rozwiązania zaprojektowane z myślą o funkcjonalności i elegancji.',
    image: '/images/Rolety.jpg',
    link: '/rolety',
    buttonText: 'POZNAJ OFERTĘ',
    gradientDirection: 'to-t',
  },
];
