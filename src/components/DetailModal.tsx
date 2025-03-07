import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { CardData } from '../types/CardData';

type DetailModalProps = {
    open: boolean;
    onClose: () => void;
    card: CardData;
};

function normalizeString(str: string): string {
    return str
        .toLowerCase()
        // Reemplazar caracteres especiales comunes en nombres japoneses
        .replace(/ou/g, 'o')
        .replace(/uu/g, 'u')
        .replace(/aa/g, 'a')
        .replace(/ee/g, 'e')
        .replace(/ii/g, 'i')
        // Normalizar otros caracteres
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Eliminar caracteres especiales y espacios extra
        .replace(/[^\w\s]/g, '')
        .trim();
}

function calculateSimilarity(str1: string, str2: string): number {
    const s1 = normalizeString(str1);
    const s2 = normalizeString(str2);
    
    // Si uno contiene al otro, alta similitud
    if (s1.includes(s2) || s2.includes(s1)) {
        return 0.9;
    }

    // Calcular cuántas palabras coinciden
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
}

interface AnimeResponse {
    data: Array<{
        mal_id: number;
        titles: Array<{
            title: string;
            type: string;
        }>;
    }>;
}

interface CharacterResponse {
    data: Array<{
        character: {
            images: {
                jpg: {
                    image_url: string;
                };
            };
            name: string;
        };
    }>;
}

export default function DetailModal({ open, onClose, card }: DetailModalProps) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (!card.character || !card.series) return;
            
            setLoading(true);
            setError(null);

            try {
                // Primero buscamos el anime para obtener su ID
                const animeQuery = encodeURIComponent(card.series);
                const animeResponse = await fetch(
                    `https://api.jikan.moe/v4/anime?q=${animeQuery}&sfw`
                );

                if (!animeResponse.ok) throw new Error('Error en la búsqueda del anime');

                const animeData: AnimeResponse = await animeResponse.json();
                
                if (animeData.data && animeData.data.length > 0) {
                    const animeId = animeData.data[0].mal_id;
                    
                    // Esperamos un poco para respetar el rate limit de la API
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Buscamos los personajes del anime
                    const charactersResponse = await fetch(
                        `https://api.jikan.moe/v4/anime/${animeId}/characters`
                    );

                    if (!charactersResponse.ok) throw new Error('Error en la búsqueda de personajes');

                    const charactersData: CharacterResponse = await charactersResponse.json();
                    
                    // Buscamos el personaje con la mayor similitud
                    let bestMatch = null;
                    let bestSimilarity = 0;

                    charactersData.data.forEach(char => {
                        const charName = char.character.name;
                        // Probar tanto el nombre original como el formato invertido
                        const [lastName, firstName] = charName.split(', ').reverse();
                        const fullName = firstName ? `${firstName} ${lastName}` : lastName;
                        
                        const similarity1 = calculateSimilarity(card.character, charName);
                        const similarity2 = calculateSimilarity(card.character, fullName);
                        const maxSimilarity = Math.max(similarity1, similarity2);

                        if (maxSimilarity > bestSimilarity) {
                            bestSimilarity = maxSimilarity;
                            bestMatch = char;
                        }
                    });

                    if (bestMatch && bestSimilarity > 0.3) { // Umbral de similitud
                        setImageSrc(bestMatch.character.images.jpg.image_url);
                    } else {
                        throw new Error('No se encontró la imagen del personaje');
                    }
                } else {
                    throw new Error('No se encontró el anime');
                }
            } catch (err) {
                console.error('Error fetching image:', err);
                setError('No se encontró la imagen del personaje');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchImage();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [card.character, card.series]);

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minHeight: '60vh'
                }
            }}
        >
            <DialogTitle sx={{ 
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                backgroundColor: 'background.paper',
                fontWeight: 'bold'
            }}>
                {card.character} - {card.series}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                    py: 2
                }}>
                    <Box>
                        <p><strong>Code:</strong> {card.code}</p>
                        <p><strong>Number:</strong> {card.number}</p>
                        <p><strong>Edition:</strong> {card.edition}</p>
                        <p><strong>Character:</strong> {card.character}</p>
                        <p><strong>Series:</strong> {card.series}</p>
                        <p><strong>Quality:</strong> {card.quality}</p>
                        <p><strong>Obtained Date:</strong> {card.obtainedDate?.toLocaleDateString()}</p>
                        <p><strong>Burn Value:</strong> {card.burnValue}</p>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        borderRadius: 2,
                        p: 2,
                        minHeight: 300,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                <p>{error}</p>
                            </Box>
                        ) : imageSrc ? (
                            <img 
                                src={imageSrc} 
                                alt={card.character}
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onClick={() => window.open(imageSrc, '_blank')}
                            />
                        ) : null}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', p: 2 }}>
                <Button onClick={onClose} variant="contained">Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
