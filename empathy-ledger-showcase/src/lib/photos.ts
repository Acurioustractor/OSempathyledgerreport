import fs from 'fs';
import path from 'path';
import exifr from 'exifr';

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  tags?: string[];
  location?: string;
  date?: string;
}

export async function getPhotos(): Promise<Photo[]> {
  const photosDir = path.resolve(process.cwd(), 'public/data/Photos');
  const imageFiles = fs.readdirSync(photosDir).filter(file => 
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );

  const photos: Photo[] = [];

  for (const file of imageFiles) {
    try {
      const filePath = path.join(photosDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const exif = await exifr.parse(fileBuffer, {
        iptc: true,
        exif: true,
        gps: true,
        xmp: true,
      });

      // Assuming image dimensions are available, otherwise we might need another library like 'image-size'
      // For now, using placeholder dimensions. We can enhance this later.
      const width = exif?.width || 1920;
      const height = exif?.height || 1080;
      
      const tags = exif?.Keywords || exif?.subject;
      const location = exif?.GPSPosition;
      const date = exif?.DateTimeOriginal?.toISOString() || exif?.CreateDate?.toISOString();

      photos.push({
        src: `/data/Photos/${file}`,
        width,
        height,
        alt: exif?.ImageDescription || file,
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
        location,
        date,
      });
    } catch (error) {
      console.error(`Could not process image ${file}:`, error);
      // Still add a basic version of the photo even if EXIF fails
      photos.push({
        src: `/data/Photos/${file}`,
        width: 1920,
        height: 1080,
        alt: file,
      });
    }
  }

  return photos;
} 