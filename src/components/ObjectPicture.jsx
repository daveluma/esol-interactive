import React from 'react';

// An object's picture: its photo if it has one (objects.js `image`), else its emoji.
// The photo is sized in em, so it scales with the surrounding font size like an emoji does.
export default function ObjectPicture({ emoji, image, alt = '' }) {
  if (image) return <img className="object-img" src={image} alt={alt} draggable={false} />;
  return <span aria-hidden={alt ? undefined : true}>{emoji}</span>;
}
