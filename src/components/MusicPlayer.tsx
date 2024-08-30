import  { useEffect, useRef, useState } from 'react';
import { IconButton, Tooltip, Box, Typography, Slider } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';
import { createMusicWebSocket } from '../services/api';
import { keyframes } from '@mui/material'; 

type MusicPlayerProps = {
    currentTrack: any;
};

const scrollAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

export default function MusicPlayer({ }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(20);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [trackInfo, setTrackInfo] = useState<string>('');

    useEffect(() => {
        audioRef.current = new Audio('https://listen.moe/stream');
        audioRef.current.volume = volume / 100;

        const ws = createMusicWebSocket((newTrack: any) => {
            setTrackInfo(`${newTrack.title} - ${newTrack.artists[0].name}`);
        });

        return () => {
            ws.close();
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
        const newVolume = newValue as number;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
            setIsMuted(newVolume === 0);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '300px' }}>
            <Tooltip title={isPlaying ? "Pause" : "Play"}>
                <IconButton onClick={togglePlay} size="small">
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
            </Tooltip>
            <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                <IconButton onClick={toggleMute} size="small">
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
            </Tooltip>
            <Slider
                size="small"
                value={volume}
                onChange={handleVolumeChange}
                aria-labelledby="volume-slider"
                sx={{ width: 80 }}
            />
            <Box sx={{ width: '150px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Typography 
                    variant="caption" 
                    sx={{
                        display: 'inline-block',
                        animation: `${scrollAnimation} 20s linear infinite`,
                        '&:hover': {
                            animationPlayState: 'paused',
                        },
                    }}
                >
                    {trackInfo}
                </Typography>
            </Box>
        </Box>
    );
}