import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CraftingProcess.css';

function CraftingProcess() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 1,
      titleKey: 'craftingStep1Title',
      descKey: 'craftingStep1Desc',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80'
    },
    {
      id: 2,
      titleKey: 'craftingStep2Title',
      descKey: 'craftingStep2Desc',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
    },
    {
      id: 3,
      titleKey: 'craftingStep3Title',
      descKey: 'craftingStep3Desc',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=80'
    },
    {
      id: 4,
      titleKey: 'craftingStep4Title',
      descKey: 'craftingStep4Desc',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&q=80'
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % steps.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + steps.length) % steps.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section className="crafting-process-section" aria-label="Crafting Process">
      <div className="section-header">
        <h2 className="section-title">{t('craftingProcessTitle')}</h2>
        <p className="section-subtitle">{t('craftingProcessSubtitle')}</p>
      </div>

      <div 
        className="carousel-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="Crafting process carousel"
      >
        <div className="carousel-wrapper">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`carousel-slide ${
                index === currentSlide ? 'active' : ''
              } ${index < currentSlide ? 'prev' : ''} ${
                index > currentSlide ? 'next' : ''
              }`}
              aria-hidden={index !== currentSlide}
            >
              <div className="slide-image-wrapper">
                <img 
                  src={step.image} 
                  alt={t(step.titleKey)}
                  className="slide-image"
                />
                <div className="slide-overlay"></div>
              </div>
              <div className="slide-content">
                <span className="step-number">Step {step.id}</span>
                <h3 className="slide-title">{t(step.titleKey)}</h3>
                <p className="slide-description">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="carousel-arrow prev-arrow"
          onClick={prevSlide}
          aria-label="Previous slide"
          disabled={isAnimating}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          className="carousel-arrow next-arrow"
          onClick={nextSlide}
          aria-label="Next slide"
          disabled={isAnimating}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="carousel-dots" role="tablist" aria-label="Slide navigation">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              role="tab"
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CraftingProcess;
