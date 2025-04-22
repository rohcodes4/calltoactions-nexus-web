import React from 'react';

const BulletPoints = ({ text }) => {
  const points = text
    .split('•')
    .map(point => point.trim())
    .filter(point => point.length > 0);

  return (
    <div>
      {points.map((point, index) => (
        <p key={index}>• {point}</p>
      ))}
    </div>
  );
};

export default BulletPoints;
