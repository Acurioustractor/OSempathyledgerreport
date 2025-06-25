'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Helper to format date to 'MMM YYYY'
function formatMonth(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

// Define the Photo type inline
interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  tags?: string[];
  location?: string;
  date?: string;
}

const PhotosPageClient = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(-1);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [activeLocation, setActiveLocation] = useState<string>('All');
  const [activeMonth, setActiveMonth] = useState<string>('All');

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then((data: Photo[]) => setPhotos(data));
  }, []);

  // Defensive: always treat tags as array
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    photos.forEach(photo => {
      const tagList = Array.isArray(photo.tags)
        ? photo.tags
        : typeof photo.tags === 'string'
          ? [photo.tags]
          : [];
      tagList.forEach(tag => tags.add(tag));
    });
    return ['All', ...Array.from(tags)];
  }, [photos]);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    photos.forEach(photo => {
      if (photo.location) locations.add(photo.location);
    });
    return ['All', ...Array.from(locations)];
  }, [photos]);

  const allMonths = useMemo(() => {
    const months = new Set<string>();
    photos.forEach(photo => {
      const month = formatMonth(photo.date);
      if (month) months.add(month);
    });
    return ['All', ...Array.from(months)];
  }, [photos]);

  // Filtering logic
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Tag filter
      const tagList = Array.isArray(photo.tags)
        ? photo.tags
        : typeof photo.tags === 'string'
          ? [photo.tags]
          : [];
      const tagMatch = activeTag === 'All' || tagList.includes(activeTag);
      // Location filter
      const locationMatch = activeLocation === 'All' || photo.location === activeLocation;
      // Month filter
      const month = formatMonth(photo.date);
      const monthMatch = activeMonth === 'All' || month === activeMonth;
      return tagMatch && locationMatch && monthMatch;
    });
  }, [photos, activeTag, activeLocation, activeMonth]);

  // Gallery styling
  const renderPhoto = ({ photo, wrapperStyle, imageProps }: any) => (
    <div
      style={{
        ...wrapperStyle,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        background: '#fff',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
      }}
      className="hover:shadow-lg"
      onClick={imageProps.onClick}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
          aspectRatio: `${photo.width}/${photo.height}`,
          background: '#f8f8f8',
        }}
        loading="lazy"
      />
    </div>
  );

  // Filter button component
  const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      className={`px-3 py-1 rounded-full border text-sm font-medium mr-2 mb-2 transition-colors ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Photo Gallery</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        {/* Tag filter */}
        <div>
          <div className="mb-1 text-xs text-gray-500">Tags</div>
          <div className="flex flex-wrap">
            {allTags.map(tag => (
              <FilterButton
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        </div>
        {/* Location filter */}
        <div>
          <div className="mb-1 text-xs text-gray-500">Location</div>
          <div className="flex flex-wrap">
            {allLocations.map(loc => (
              <FilterButton
                key={loc}
                label={loc}
                active={activeLocation === loc}
                onClick={() => setActiveLocation(loc)}
              />
            ))}
          </div>
        </div>
        {/* Month filter */}
        <div>
          <div className="mb-1 text-xs text-gray-500">Month</div>
          <div className="flex flex-wrap">
            {allMonths.map(month => (
              <FilterButton
                key={month}
                label={month}
                active={activeMonth === month}
                onClick={() => setActiveMonth(month)}
              />
            ))}
          </div>
        </div>
      </div>
      <PhotoAlbum
        layout="masonry"
        photos={filteredPhotos.map(photo => ({
          src: photo.src,
          width: photo.width || 800,
          height: photo.height || 600,
          alt: photo.alt,
        }))}
        renderPhoto={renderPhoto}
        spacing={16}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        slides={filteredPhotos.map(photo => ({
          src: photo.src,
          alt: photo.alt,
        }))}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </div>
  );
};

export default PhotosPageClient; 