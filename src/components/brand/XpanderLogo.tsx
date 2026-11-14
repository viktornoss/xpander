'use client';

import React from 'react';
import Link from 'next/link';

interface XpanderLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  linkToHome?: boolean;
  iconColor?: string;
  textColor?: string;
}

export default function XpanderLogo({
  className = '',
  iconOnly = false,
  size = 'md',
  showSubtitle = false,
  subtitleText = 'Enterprise AI Platform',
  linkToHome = false,
  iconColor = 'text-white',
  textColor = 'text-white'
}: XpanderLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-4 h-4', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-6 h-6', text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 'w-8 h-8', text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 'w-10 h-10', text: 'text-3xl', gap: 'gap-3.5' }
  };

  const { icon, text, gap } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center ${gap} ${className} group select-none`}>
      {/* Official 4-petal X mark */}
      <div className={`relative shrink-0 flex items-center justify-center ${icon}`}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-full h-full ${iconColor} transition-transform duration-300 group-hover:scale-105`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(12, 12)">
            {/* 4 organic tapered petals meeting at the center to form the signature X */}
            <path
              d="M -1.6 -2.4 C -2.3 -4.5, -2.4 -7.5, 0 -10 C 2.4 -7.5, 2.3 -4.5, 1.6 -2.4 C 1 -1.4, -1 -1.4, -1.6 -2.4 Z"
              transform="rotate(45)"
            />
            <path
              d="M -1.6 -2.4 C -2.3 -4.5, -2.4 -7.5, 0 -10 C 2.4 -7.5, 2.3 -4.5, 1.6 -2.4 C 1 -1.4, -1 -1.4, -1.6 -2.4 Z"
              transform="rotate(135)"
            />
            <path
              d="M -1.6 -2.4 C -2.3 -4.5, -2.4 -7.5, 0 -10 C 2.4 -7.5, 2.3 -4.5, 1.6 -2.4 C 1 -1.4, -1 -1.4, -1.6 -2.4 Z"
              transform="rotate(225)"
            />
            <path
              d="M -1.6 -2.4 C -2.3 -4.5, -2.4 -7.5, 0 -10 C 2.4 -7.5, 2.3 -4.5, 1.6 -2.4 C 1 -1.4, -1 -1.4, -1.6 -2.4 Z"
              transform="rotate(315)"
            />
          </g>
        </svg>
      </div>

      {/* Official lowercase bold typography: xpander.ai */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span className={`font-extrabold tracking-[-0.03em] ${text} ${textColor} transition-colors`}>
              xpander.ai
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">
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

