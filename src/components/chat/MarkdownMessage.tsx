'use client';

import React from 'react';

interface MarkdownMessageProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Lightweight, safe markdown formatter for AI responses
 * Handles bold (**text**), italics (*text*), bullet points (- or *), code blocks, and headers.
 */
export default function MarkdownMessage({ content, isStreaming }: MarkdownMessageProps) {
  // Split lines
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-[13px] leading-relaxed select-text">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Horizontal separator
        if (trimmed === '---') {
          return <hr key={lineIdx} className="border-t border-white/10 my-2" />;
        }

        // Header 3 or 4
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="font-bold text-white text-sm pt-1">
              {renderFormattedText(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Header 2
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="font-bold text-white text-base pt-1">
              {renderFormattedText(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // Bullet point list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
              <div className="flex-1 text-gray-200">
                {renderFormattedText(trimmed.replace(/^[-*]\s+/, ''))}
              </div>
            </div>
          );
        }

        // Numbered list item
        if (/^\d+\.\s+/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (match) {
            const num = match[1];
            const text = match[2];
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-2">
                <span className="text-xs font-mono font-bold text-neon-purple shrink-0 mt-0.5">
                  {num}.
                </span>
                <div className="flex-1 text-gray-200">
                  {renderFormattedText(text)}
                </div>
              </div>
            );
          }
        }

        // Regular paragraph line
        return (
          <p key={lineIdx} className="text-gray-200">
            {renderFormattedText(line)}
            {isStreaming && lineIdx === lines.length - 1 && (
              <span className="inline-block w-2 h-4 ml-1 bg-neon-purple animate-pulse align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses bold (**text**), code (`code`), and italics (*text*)
 */
function renderFormattedText(text: string): React.ReactNode[] {
  // Simple token parser for **bold** and `code`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-black/40 text-neon-blue font-mono text-[11px] border border-white/10">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

