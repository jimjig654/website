import * as React from 'react';
import { useState } from 'react';
import Links from './components/Links';
import NyanCats from './components/NyanCat';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [isScared, setIsScared] = useState(false);
  
  const handleScared = () => {
    setIsScared(true);
    setTimeout(() => setIsScared(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-indigo-900 overflow-hidden">
      <NyanCats />
      <AudioPlayer onScared={handleScared} />
      <div className={`container mx-auto px-4 py-8 flex flex-col items-center relative z-20 transition-all duration-300 ${isScared ? 'scale-95 opacity-80' : ''}`}>
        <h1 className="text-4xl font-bold text-white mb-8 text-center rainbow-text">:3</h1>
        <Links />
      </div>
    </div>
  );
}

export default App;
