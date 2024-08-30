// src/components/CardInventoryDashboard.tsx
import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Modal
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BarChartIcon from '@mui/icons-material/BarChart';
import { createMusicWebSocket } from './services/api';
import MusicPlayer from './components/MusicPlayer';
import ErrorSnackbar from './components/ErrorSnackbar';
import FileUpload from './components/FileUpload';
import SearchSort from './components/SearchSort';
import CardTable from './components/CardTable';
import DetailModal from './components/DetailModal';
import CardStatistics from './components/CardStatistics';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';
import './CardInventoryDashboard.css';
import { CardData } from './types/CardData';

export default function CardInventoryDashboard() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CardData>('character');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  const { isDarkMode, toggleTheme } = useCustomTheme();

  useEffect(() => {
    filterAndSortCards();
  }, [cards, searchTerm, sortField, sortOrder]);

  useEffect(() => {
    const ws = createMusicWebSocket((track) => {
      setCurrentTrack(track);
    });
    toggleTheme()
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleSortChange = (field: keyof CardData) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
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

  const handleRowClick = (card: CardData) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCard(null);
  };

  const handleFileUpload = (parsedCards: CardData[]) => {
    setCards(parsedCards);
    setFilteredCards(parsedCards);  // Actualizar también filteredCards
  };

  return (
    <Box className="dashboard-container" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Paper className="dashboard-paper">
        <Box className='search-upload-bar mb-30' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="primary" className="dashboard-title">
            Karuta Card Manager v0.7
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MusicPlayer currentTrack={currentTrack} />
            <IconButton onClick={() => setStatsModalOpen(true)} color="inherit">
              <BarChartIcon />
            </IconButton>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Box>

        <Box className='search-upload-bar'>
          <FileUpload onFileUpload={handleFileUpload} />
          <SearchSort
            searchTerm={searchTerm}
            onSearchTermChange={(term) => setSearchTerm(term)}
            sortField={sortField}
            onSortFieldChange={(field) => setSortField(field)}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          />
        </Box>

        <CardTable
          cards={filteredCards}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRowClick={handleRowClick}
        />

        {error && <ErrorSnackbar error={error} onClose={handleCloseError} />}

        {selectedCard && (
          <DetailModal
            open={modalOpen}
            onClose={handleCloseModal}
            card={selectedCard}
          />
        )}

        <Modal
          open={statsModalOpen}
          onClose={() => setStatsModalOpen(false)}
          aria-labelledby="stats-modal-title"
          aria-describedby="stats-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="stats-modal-title" variant="h5" component="h2" gutterBottom>
              Card Collection Statistics
            </Typography>
            <CardStatistics cards={cards} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setStatsModalOpen(false)} variant="contained">Close</Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
}