"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, VolumeX } from "lucide-react";
import { FaSpotify } from "react-icons/fa";

// GANTI SESUAI LAGU KAMU
const SONG_TITLE = "Bye";
const SONG_ARTIST = "Altare";
const AUDIO_SRC = "/audio/song.mp3"; // taruh file lagu di public/audio/
const COVER_ART = "/audio/cover.webp"; // taruh gambar cover album di public/audio/cover.jpg

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealInfo = () => {
    setShowInfo(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    // Widget "Now Playing" otomatis mengecil lagi setelah 4 detik
    hideTimer.current = setTimeout(() => setShowInfo(false), 4000);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          revealInfo();
        })
        .catch(() => {
          // Autoplay diblokir browser, nunggu interaksi pertama dari user
        });
    };

    tryPlay();

    // Fallback: begitu user klik / scroll / tekan tombol apapun pertama kali,
    // musik otomatis mulai (mengakali kebijakan autoplay browser)
    const onFirstInteraction = () => {
      if (audio.paused) tryPlay();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("scroll", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);

    return () => {
      cleanup();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          revealInfo();
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop />

      {/* Tombol musik: piringan hitam muter + widget "Now Playing" yang muncul lalu mengecil */}
      <motion.button
        layout
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-40 flex items-center gap-3 bg-white/90 backdrop-blur-md border border-brand-text/10 rounded-full p-2.5 shadow-lg overflow-hidden cursor-pointer"
      >
        <div className="relative w-11 h-11 shrink-0">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
            className="w-11 h-11 rounded-full overflow-hidden bg-brand-text flex items-center justify-center ring-2 ring-white"
          >
            {!coverError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={COVER_ART}
                alt="Cover album"
                className="w-full h-full object-cover"
                onError={() => setCoverError(true)}
              />
            ) : isPlaying ? (
              <Music2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </motion.div>

          {/* Badge ikon musik di pojok */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1DB954] flex items-center justify-center ring-2 ring-white">
            <FaSpotify className="w-3 h-3 text-white" />
          </div>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden whitespace-nowrap leading-tight text-left pr-4"
            >
              <p className="text-[11px] font-bold text-brand-text/50 uppercase tracking-wide">
                Now Playing
              </p>
              <p className="text-base font-black text-brand-text">
                {SONG_TITLE}{" "}
                <span className="font-medium text-brand-text/60">
                  - {SONG_ARTIST}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}