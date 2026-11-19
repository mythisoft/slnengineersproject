import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before Treatment',
  afterLabel = 'After Restoration',
  aspectRatio = '16/10',
  className = '',
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  // Track exact container width with ResizeObserver for Chrome/Edge resizing, zoom, and window snapping
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(Math.round(rect.width));
        }
      }
    };

    updateWidth();

    // ResizeObserver tracks dynamic changes in Chromium when snapped or resized
    let observer = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect?.width || entry.target?.clientWidth;
          if (width) setContainerWidth(Math.round(width));
        }
      });
      observer.observe(el);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  }, []);

  // Pointer Event handlers (Edge, Chrome, touchscreen laptops, and mobile)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return; // Only primary button
    setIsDragging(true);
    updatePosition(e.clientX);
    if (e.currentTarget?.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
        // Fallback
      }
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      if (e.currentTarget?.releasePointerCapture) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) {
          // Fallback
        }
      }
    }
  };

  // Click to jump anywhere on slider
  const handleClick = (e) => {
    updatePosition(e.clientX);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ba-container relative overflow-hidden select-none cursor-ew-resize ${className}`}
      style={{ aspectRatio, touchAction: 'pan-y' }}
      role="slider"
      aria-label="Before and after image comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuetext={`${Math.round(sliderPosition)}% before image shown`}
      tabIndex={0}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') setSliderPosition((position) => Math.max(0, position - 2));
        if (event.key === 'ArrowRight') setSliderPosition((position) => Math.min(100, position + 2));
        if (event.key === 'Home') setSliderPosition(0);
        if (event.key === 'End') setSliderPosition(100);
      }}
    >
      {/* After Image (Full background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        loading="lazy"
        draggable={false}
      />
      {/* After Label Badge */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-slate-950/85 text-white border border-emerald-500/40 text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xl backdrop-blur-md z-10 flex items-center gap-2 pointer-events-none transition-transform duration-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-xs">AFTER</span>
        <span className="hidden sm:inline text-slate-100 font-medium text-xs max-w-[190px] md:max-w-xs truncate">{afterLabel}</span>
      </div>

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none select-none"
          style={{ width: containerWidth ? `${containerWidth}px` : '100%', height: '100%' }}
          loading="lazy"
          draggable={false}
        />
        {/* Before Label Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-slate-950/85 text-white border border-rose-500/40 text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xl backdrop-blur-md z-10 flex items-center gap-2 pointer-events-none transition-transform duration-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-xs">BEFORE</span>
          <span className="hidden sm:inline text-slate-100 font-medium text-xs max-w-[190px] md:max-w-xs truncate">{beforeLabel}</span>
        </div>
      </div>

      {/* Draggable Divider Line */}
      <div
        className="ba-slider-handle"
        style={{ left: `${sliderPosition}%`, touchAction: 'none' }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handlePointerDown(e);
        }}
      >
        <div className="ba-slider-button" style={{ touchAction: 'none' }}>
          <MoveHorizontal size={18} />
        </div>
      </div>
    </div>
  );
}
