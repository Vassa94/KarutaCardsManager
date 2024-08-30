import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Star, StarBorder, ArrowDropDown, ArrowDropUp, LooksOne,LooksTwo, Looks3, Looks4, Looks5, Looks6  } from '@mui/icons-material';
import CoinIcon from '../assets/img/coin.svg';
import { CardData } from '../types/CardData';


type CardTableProps = {
    cards: CardData[];
    sortField: keyof CardData;
    sortOrder: 'asc' | 'desc';
    onSortChange: (field: keyof CardData) => void;
    onRowClick: (card: CardData) => void; // Nueva prop
};

const edition = [ <LooksOne />, <LooksTwo />, <Looks3 />, <Looks4 />, <Looks5 />, <Looks6/> ]

const columns: (keyof CardData)[] = [
    'code',
    'number',
    'edition',
    'character',
    'series',
    'quality',
    'obtainedDate',
    'burnValue',
];

export default function CardTable({
    cards,
    sortField,
    sortOrder,
    onSortChange,
    onRowClick, // Nueva prop
}: CardTableProps) {
    const processedCards = cards.map(card => ({
        ...card,
        obtainedDate: new Date(card.obtainedDate),
    }));

    const renderStars = (quality: string) => {
        const starsCount = parseInt(quality, 10);
        const totalStars = 4;

        return (
            <>
                {[...Array(totalStars)].map((_, index) =>
                    index < starsCount ? (
                        <Star key={index} style={{ color: 'gold' }} />
                    ) : (
                        <StarBorder key={index} style={{ color: 'gold' }} />
                    )
                )}
            </>
        );
    };

    const handleSort = (field: keyof CardData) => {
        onSortChange(field);
    };

    const renderBurnValue = (value: number) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>{value}</span>
            <img
                src={CoinIcon}
                alt="Coin Icon"
                style={{ width: 20, height: 20, marginLeft: 5 }}
            />
        </div>
    );

    const renderDate = (date: Date) => date.toLocaleDateString();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((key) => (
                            <TableCell
                                key={key}
                                onClick={() => handleSort(key)}
                                className="columns-headers"
                            >
                                <div className={`header-cell header-${key}`}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    {sortField === key && (
                                        sortOrder === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                                    )}
                                </div>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processedCards.map((card, index) => (
                        <TableRow
                            key={index}
                            onClick={() => onRowClick(card)} // Manejar clic en la fila
                            style={{ cursor: 'pointer' }}
                        >
                            {columns.map((key) => (
                                <TableCell key={key} className={`cell-${key} ${key === 'code' ? 'strong-text' : ''}`}>
                                    {key === 'quality' ? renderStars(card[key] as string) :
                                        key === 'burnValue' ? renderBurnValue(card[key] as number) :
                                            key === 'obtainedDate' ? renderDate(card[key] as Date) :
                                                key === 'edition' ? edition[card[key]-1] :
                                                String(card[key])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
