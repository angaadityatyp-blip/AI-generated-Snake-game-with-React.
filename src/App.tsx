/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#0ff] font-vt flex flex-col items-center justify-center p-4 crt-flicker relative overflow-hidden">
      <div className="scanlines"></div>
      <div className="noise"></div>
      
      <div className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        <div className="lg:col-span-2 flex flex-col items-center bg-black p-6 glitch-border">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 border-b-2 border-[#f0f] pb-4 gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl glitch-text text-[#0ff]" data-text="SYS.DANGER_PROTOCOL">
              SYS.DANGER_PROTOCOL
            </h1>
            <div className="text-lg sm:text-xl font-pixel text-[#f0f]">
              REGISTRY: {score.toString().padStart(4, '0')}
            </div>
          </div>
          <div className="flex items-center gap-8 w-full justify-center">
            <SnakeGame onScoreChange={setScore} />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col bg-black p-6 glitch-border">
          <h2 className="text-lg sm:text-xl font-pixel mb-4 glitch-text text-[#f0f] border-b-2 border-[#0ff] pb-4" data-text="AUDIO.STREAM_OVERRIDE">
            AUDIO.STREAM_OVERRIDE
          </h2>
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}

