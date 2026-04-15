import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'SYS_AUDIO_01.WAV', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPTED_DATA.MP3', artist: 'NULL_POINTER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'VOID_SIGNAL.FLAC', artist: 'SECTOR_7', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };
  const toggleMute = () => { if (audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted); } };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between font-vt">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={nextTrack} />
      
      <div className="flex-1 flex flex-col items-center justify-center mb-8 mt-4">
        <div className={`w-32 h-32 border-4 border-[#0ff] flex items-center justify-center mb-6 shadow-[8px_8px_0_#f0f] relative overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
          {isPlaying && <div className="absolute inset-0 bg-[#0ff] opacity-20 animate-[flicker_0.1s_infinite]"></div>}
          <div className="text-4xl font-pixel text-[#f0f] glitch-text" data-text="WAV">WAV</div>
        </div>
        
        <div className="text-center w-full px-4">
          <div className="text-[#0ff] font-pixel text-sm truncate mb-2 uppercase">
            {currentTrack.title}
          </div>
          <div className="text-[#f0f] text-xl uppercase tracking-widest">
            ID: {currentTrack.artist}
          </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Progress Bar */}
        <div className="w-full h-4 border-2 border-[#0ff] bg-black relative">
          <div 
            className="h-full bg-[#f0f] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          {/* Glitch artifacts on progress bar */}
          {isPlaying && Math.random() > 0.5 && (
            <div className="absolute top-0 h-full bg-[#0ff] w-2" style={{ left: `${Math.random() * 100}%` }}></div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2">
          <button onClick={toggleMute} className="text-[#0ff] font-pixel text-xs hover:text-[#f0f] uppercase cursor-pointer">
            {isMuted ? '[MUTE:ON]' : '[MUTE:OFF]'}
          </button>

          <div className="flex items-center gap-4 font-pixel text-sm">
            <button onClick={prevTrack} className="text-[#0ff] hover:text-[#f0f] hover:scale-110 transition-transform cursor-pointer">
              &lt;&lt;
            </button>
            <button onClick={togglePlay} className="px-4 py-2 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black shadow-[4px_4px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer uppercase">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
            <button onClick={nextTrack} className="text-[#0ff] hover:text-[#f0f] hover:scale-110 transition-transform cursor-pointer">
              &gt;&gt;
            </button>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>
        
        {/* Track List */}
        <div className="mt-6 space-y-2 border-t-2 border-[#f0f] pt-4">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              className={`w-full text-left px-3 py-2 border-2 flex items-center justify-between text-xl uppercase transition-colors cursor-pointer ${
                idx === currentTrackIndex 
                  ? 'border-[#0ff] bg-[#0ff]/10 text-[#0ff]' 
                  : 'border-transparent text-[#f0f] hover:border-[#f0f]/50'
              }`}
            >
              <span className="truncate pr-2">{track.title}</span>
              {idx === currentTrackIndex && isPlaying && (
                <span className="font-pixel text-xs animate-pulse text-[#0ff]">[ACTIVE]</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
