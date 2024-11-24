import React, { useState, useCallback, useEffect } from 'react';
import { SeedPhraseInput } from './components/SeedPhraseInput';
import { Button } from './components/Button';
import { generatePemContent } from './utils/pemGenerator';
import logo from './assets/logo.svg';

function App() {
  const [seedPhraseWords, setSeedPhraseWords] = useState<string[]>(Array(24).fill(''));
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Clear sensitive data when component unmounts or tab is closed
  useEffect(() => {
    const cleanup = () => {
      setSeedPhraseWords(Array(24).fill(''));
      // Force garbage collection hint
      if (window.gc) window.gc();
    };

    // Cleanup on tab close or hide
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) cleanup();
    });

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('visibilitychange', cleanup);
    };
  }, []);

  const handleWordChange = useCallback((index: number, value: string) => {
    setSeedPhraseWords(prev => {
      const newWords = [...prev];
      newWords[index] = value.toLowerCase().trim();
      return newWords;
    });
    setError('');
  }, []);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');

      // Validate all words are filled
      if (seedPhraseWords.some(word => !word.trim())) {
        throw new Error('Please fill in all seed phrase words');
      }

      const seedPhrase = seedPhraseWords.join(' ').trim();
      
      // Generate PEM content
      const pemContent = await generatePemContent(seedPhrase);

      // Create blob and download
      const blob = new Blob([pemContent], { 
        type: 'application/x-pem-file'
      });
      
      const url = URL.createObjectURL(blob);

      // Create and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'wallet.pem';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      // Clear sensitive data
      setSeedPhraseWords(Array(24).fill(''));
      
      // Clear clipboard
      try {
        await navigator.clipboard.writeText('');
      } catch (_) {
        // Ignore clipboard errors
      }

    } catch (err) {
      console.error('Error in handleGenerate:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
      if (window.gc) window.gc();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <img 
              src={logo} 
              alt="HODL Token Club" 
              className="h-20 w-20"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="text-xl font-semibold text-indigo-300">
                HODL Token Club
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                PEM Generator for MultiversX Transfers App
              </h1>
              <div className="text-sm text-indigo-300/80">
                make.com Custom App Authentication
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-indigo-500/10 shadow-xl">
            <p className="text-gray-300 mb-6 text-center">
              Enter your 24-word seed phrase to generate a PEM file. Your data never leaves your browser.
            </p>

            <SeedPhraseInput
              values={seedPhraseWords}
              onChange={handleWordChange}
              disabled={isGenerating}
            />

            {error && (
              <div className="mt-4 text-red-400 text-center">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate PEM File'}
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-400 text-center">
              <p>Security Notice: All processing is done locally in your browser.</p>
              <p>No data is stored or transmitted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;