import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width = '100%', height = '100%', circle = false }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : '4px',
        backgroundColor: '#e9ecef',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="skeleton-card">
    <Skeleton height="250px" />
    <div style={{ padding: '1rem' }}>
      <Skeleton height="20px" width="80%" style={{ marginBottom: '0.5rem' }} />
      <Skeleton height="16px" width="100%" style={{ marginBottom: '0.5rem' }} />
      <Skeleton height="16px" width="90%" style={{ marginBottom: '1rem' }} />
      <Skeleton height="40px" width="100%" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="skeleton-table">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="skeleton-row">
        <div className="skeleton-cell skeleton-image-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
        <div className="skeleton-cell"></div>
      </div>
    ))}
  </div>
);

export default Skeleton;
