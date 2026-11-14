'use client';

import React from 'react';
import Link from 'next/link';

interface ZentrionLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  linkToHome?: boolean;
  iconColor?: string;
  textColor?: string;
}

export default function ZentrionLogo({
  className = '',
  iconOnly = false,
  size = 'md',
  showSubtitle = false,
  subtitleText = 'Autonomous Enterprise Platform',
  linkToHome = false,
  iconColor = 'text-white',
  textColor = 'text-white'
}: ZentrionLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-5 h-5', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-7 h-7', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-9 h-9', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-11 h-11', text: 'text-3xl', gap: 'gap-3.5' }
  };

  const { icon, text, gap } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${gap} ${className} group select-none`}>
      {/* Official Zentrion Architectural Neural Monogram */}
      <div className={`relative shrink-0 flex items-center justify-center ${icon}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105 overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="zBladeGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#a1a1aa" />
            </linearGradient>
            <filter id="zGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <mask id="zLogoAperture">
              <rect width="100" height="100" fill="#ffffff" />
              <circle cx="50" cy="50" r="10.5" fill="#000000" />
            </mask>
          </defs>

          {/* Rounded obsidian backdrop tile with specular rim */}
          <rect width="100" height="100" rx="22" fill="#0a0a0d" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <rect x="2" y="2" width="96" height="96" rx="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Precision Architectural 'Z' Blade */}
          <path
            d="M 18 20 L 82 20 L 82 34 L 41 66 L 82 66 L 82 80 L 18 80 L 18 66 L 59 34 L 18 34 Z"
            fill="url(#zBladeGrad)"
            mask="url(#zLogoAperture)"
          />

          {/* Floating Neural Pulse Core */}
          <circle cx="50" cy="50" r="5.5" fill="#ffffff" filter="url(#zGlowFilter)" />
          <circle cx="50" cy="50" r="8.2" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
        </svg>
      </div>

      {/* Official Typography: Zentrion.ai */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline tracking-tight">
            <span className={`font-black tracking-tight ${text} ${textColor} transition-colors`}>
              Zentrion
            </span>
            <span className={`font-light text-neutral-400 ml-0.5 ${text}`}>
              .ai
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[8.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase mt-0.5">
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
