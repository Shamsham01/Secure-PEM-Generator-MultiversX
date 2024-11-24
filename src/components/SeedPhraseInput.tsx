import React, { useCallback } from 'react';
import { Input } from './Input';

interface SeedPhraseInputProps {
  values: string[];
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
}

export const SeedPhraseInput: React.FC<SeedPhraseInputProps> = ({ 
  values, 
  onChange,
  disabled = false 
}) => {
  // Prevent paste of full seed phrase for security
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
  }, []);

  // Prevent drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="relative">
          <Input
            type="text"
            value={values[i] || ''}
            onChange={(e) => onChange(i, e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            placeholder={`Word ${i + 1}`}
            className="w-full bg-opacity-10 backdrop-blur-sm"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            data-lpignore="true"
            disabled={disabled}
            maxLength={20} // Reasonable limit for BIP39 words
          />
          <span className="absolute -top-3 left-2 text-xs text-purple-300 bg-gray-900 px-1">
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};