declare module '*/photo-index.json' {
  interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
    tags?: string[];
    location?: string | null;
    date?: string | null;
  }
  
  const photos: Photo[];
  export default photos;
}