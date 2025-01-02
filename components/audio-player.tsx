"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
} from "lucide-react";
import Image from "next/image";

/* eslint-disable @typescript-eslint/no-empty-object-type */
interface AudioPlayerProps {}
/* eslint-enable @typescript-eslint/no-empty-object-type */

interface Track {
  title: string;
  artist: string;
  src: string;
  image: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
        image: "/default-album-cover.jpg",
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800">Audio Player</h1>
          <label className="flex items-center cursor-pointer">
            <UploadIcon className="w-6 h-6 mr-2 text-gray-800 hover:text-teal-500 transition-colors" />
            <span className="text-lg font-medium text-gray-800">Upload</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="rounded-2xl shadow-lg bg-gray-100">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative">
              <Image
                src={tracks[currentTrackIndex]?.image || "/default-album-cover.jpg"}
                alt=""
                width={120}
                height={120}
                className="rounded-full border-4 border-teal-500 shadow-lg"
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="w-10 h-10 text-teal-500 animate-pulse" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-gray-600">
                {tracks[currentTrackIndex]?.artist || "Unknown Artist"}
              </p>
            </div>
            <div className="w-full">
              <Progress value={progress} className="rounded-full bg-teal-300" />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevTrack}
                className="hover:bg-teal-100 transition-colors"
              >
                <RewindIcon className="w-6 h-6 text-gray-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="hover:bg-teal-100 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-gray-800" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-gray-800" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextTrack}
                className="hover:bg-teal-100 transition-colors"
              >
                <ForwardIcon className="w-6 h-6 text-gray-800" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioPlayer;
