// src/components/CardStatistics.tsx
import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import CoinIcon from '../assets/img/coin.svg';
import { CardData } from '../types/CardData';

type CardStatisticsProps = {
    cards: CardData[];
};

export default function CardStatistics({ cards }: CardStatisticsProps) {
    const totalCards = cards.length;
    const uniqueSeries = new Set(cards.map(card => card.series)).size;
    const averageQuality = cards.reduce((sum, card) => sum + parseInt(card.quality), 0) / totalCards;
    const totalBurnValue = cards.reduce((sum, card) => sum + card.burnValue, 0);

    const qualityDistribution = cards.reduce((acc, card) => {
        acc[card.quality] = (acc[card.quality] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const renderStars = (quality: number) => {
        const starsCount = Math.round(quality);
        const totalStars = 4;

        return (
            <Box display="flex" alignItems="center">
                {[...Array(totalStars)].map((_, index) =>
                    index < starsCount ? (
                        <Star key={index} style={{ color: 'gold' }} />
                    ) : (
                        <StarBorder key={index} style={{ color: 'gold' }} />
                    )
                )}
                <Typography variant="body2" sx={{ ml: 1 }}>
                    ({quality.toFixed(2)})
                </Typography>
            </Box>
        );
    };

    const renderBurnValue = (value: number) => (
        <Box display="flex" alignItems="center">
            <Typography variant="h6">{value.toLocaleString()}</Typography>
            <img
                src={CoinIcon}
                alt="Coin Icon"
                style={{ width: 20, height: 20, marginLeft: 5 }}
            />
        </Box>
    );

    return (
        <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Total Cards:</Typography>
                    <Typography variant="h6">{totalCards}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Unique Series:</Typography>
                    <Typography variant="h6">{uniqueSeries}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Average Quality:</Typography>
                    {renderStars(averageQuality)}
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Typography variant="body2">Total Burn Value:</Typography>
                    {renderBurnValue(totalBurnValue)}
                </Grid>
            </Grid>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Quality Distribution:</Typography>
            <Grid container spacing={1}>
                {Object.entries(qualityDistribution).map(([quality, count]) => (
                    <Grid item xs={4} sm={2} key={quality}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ mr: 1 }}>{quality} Star:</Typography>
                            <Typography variant="body2" fontWeight="bold">{count}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}