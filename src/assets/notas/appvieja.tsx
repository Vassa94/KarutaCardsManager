/* // src/components/CardInventoryDashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel, Box, Alert, Snackbar, IconButton, Tooltip 
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, Search as SearchIcon, SortByAlpha as SortByAlphaIcon, Warning as WarningIcon,
  PlayArrow as PlayArrowIcon, Pause as PauseIcon, VolumeUp as VolumeUpIcon, VolumeOff as VolumeOffIcon 
} from '@mui/icons-material';
import Papa from 'papaparse';
import { fetchCardImage, createMusicWebSocket } from './services/api';
import './CardInventoryDashboard.css';
import gif from './assets/img/shigure-ui.gif'

type CardData = {
  code: string;
  number: string;
  edition: string;
  character: string;
  series: string;
  quality: string;
  obtainedDate: string;
  burnValue: string;
};

export default function CardInventoryDashboard() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CardData>('character');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null); // Información de la pista actual
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    filterAndSortCards();
  }, [cards, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    audioRef.current = new Audio('https://listen.moe/stream');
    audioRef.current.preload = 'none';

    wsRef.current = createMusicWebSocket((track) => {
      setCurrentTrack(track);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          try {
            if (result.errors && result.errors.length > 0) {
              throw new Error(`CSV parsing error: ${result.errors[0].message}`);
            }
            
            const parsedCards = result.data.map((row: any) => {
              if (typeof row === 'object' && row !== null) {
                return {
                  code: row.code || '',
                  number: row.number || '',
                  edition: row.edition || '',
                  character: row.character || '',
                  series: row.series || '',
                  quality: row.quality || '',
                  obtainedDate: row.obtainedDate || '',
                  burnValue: row.burnValue || '',
                };
              } else {
                throw new Error(`Invalid row data: ${JSON.stringify(row)}`);
              }
            });
            
            console.log('Parsed cards:', parsedCards);
            setCards(parsedCards);
            setError(null);
          } catch (err) {
            console.error('Error parsing CSV:', err);
            setError(`Error parsing CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        },
        error: (error) => {
          console.error('Papa Parse error:', error);
          setError(`CSV parsing error: ${error.message}`);
        },
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
    }
  };

  const filterAndSortCards = () => {
    try {
      let filtered = cards.filter((card) =>
        Object.values(card).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      filtered.sort((a, b) => {
        const aValue = a[sortField]?.toString().toLowerCase() ?? '';
        const bValue = b[sortField]?.toString().toLowerCase() ?? '';
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredCards(filtered);
    } catch (err) {
      console.error('Error filtering and sorting cards:', err);
      setError(`Error filtering and sorting cards: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

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

  return (
    <div className="dashboard-container">
      <Paper className="dashboard-paper">
        <div className="dashboard-header">
          <Typography component="h1" variant="h4" color="primary" className="dashboard-title">
            Card Inventory Dashboard
          </Typography>
          <div className="music-player">
            <img 
              src={gif} 
              alt="Music Player" 
              style={{ width: 50, height: 50, marginRight: 10 }} 
            />
            <Tooltip title={isPlaying ? "Pause" : "Play"}>
              <IconButton onClick={togglePlay}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isMuted ? "Unmute" : "Mute"}>
              <IconButton onClick={toggleMute}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>
            {currentTrack && (
              <Box mt={2}>
                <Typography variant="h6">Now Playing:</Typography>
                <Typography variant="body1">{currentTrack.title} by {currentTrack.artists.map((artist: any) => artist.name).join(', ')}</Typography>
              </Box>
            )}
          </div>
        </div>
        
        <div className="upload-button">
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
              Upload CSV
            </Button>
          </label>
        </div>

        <div className="search-sort-container">
          <div className="search-container">
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton onClick={filterAndSortCards} aria-label="search">
              <SearchIcon />
            </IconButton>
          </div>

          <div className="sort-container">
            <FormControl variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as keyof CardData)}
                label="Sort By"
              >
                {Object.keys(cards[0] || {}).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <SortByAlphaIcon />
            </IconButton>
          </div>
        </div>

        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error" icon={<WarningIcon />}>
              {error}
            </Alert>
          </Snackbar>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(cards[0] || {}).map((key) => (
                  <TableCell key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCards.map((card, index) => (
                <TableRow key={index}>
                  {Object.values(card).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
 */