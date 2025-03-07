import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Modal,
  Chip,
  Tooltip,
  Fab,
  Zoom
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BarChartIcon from '@mui/icons-material/BarChart';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListIcon from '@mui/icons-material/FilterList';
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [quickFilters] = useState([
    { 
      id: 'rare',
      label: 'Cartas más raras', 
      filter: (cards: CardData[]) => [...cards].sort((a, b) => {
        const aQuality = Number(a.quality || 0);
        const bQuality = Number(b.quality || 0);
        return bQuality - aQuality;
      })
    },
    { 
      id: 'recent',
      label: 'Últimas obtenidas', 
      filter: (cards: CardData[]) => [...cards].sort((a, b) => {
        const dateA = a.obtainedDate ? new Date(a.obtainedDate).getTime() : 0;
        const dateB = b.obtainedDate ? new Date(b.obtainedDate).getTime() : 0;
        return dateB - dateA;
      })
    },
    { 
      id: 'value',
      label: 'Mayor valor', 
      filter: (cards: CardData[]) => [...cards].sort((a, b) => {
        const valueA = parseInt(String(a.burnValue || '0'), 10);
        const valueB = parseInt(String(b.burnValue || '0'), 10);
        return valueB - valueA;
      })
    }
  ]);

  const { isDarkMode, toggleTheme } = useCustomTheme();

  useEffect(() => {
    filterAndSortCards();
  }, [cards, searchTerm, sortField, sortOrder, activeFilter]);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

      if (activeFilter) {
        const currentFilter = quickFilters.find(f => f.id === activeFilter);
        if (currentFilter) {
          filtered = currentFilter.filter(filtered);
        }
      } else {
        filtered.sort((a, b) => {
          const aValue = a[sortField]?.toString().toLowerCase() ?? '';
          const bValue = b[sortField]?.toString().toLowerCase() ?? '';
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const applyQuickFilter = (filterId: string) => {
    if (activeFilter === filterId) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterId);
    }
  };

  return (
    <Box className="dashboard-container" sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <Paper className="dashboard-paper">
        <Box className='search-upload-bar mb-30' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" color="primary" className="dashboard-title">
            Karuta Card Manager v1.0
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

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {quickFilters.map((filter) => (
            <Tooltip key={filter.id} title={`Filtrar por ${filter.label}`}>
              <Chip
                icon={<FilterListIcon />}
                label={filter.label}
                onClick={() => applyQuickFilter(filter.id)}
                color={activeFilter === filter.id ? "primary" : "default"}
                variant={activeFilter === filter.id ? "filled" : "outlined"}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ))}
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

        <Zoom in={showScrollTop}>
          <Fab
            color="primary"
            size="small"
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>
      </Paper>
    </Box>
  );
}