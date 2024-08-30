import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import {CardData} from '../types/CardData'

// Actualizar el tipo CardData con los nuevos tipos
/* type CardData = {
    code: string;
    number: number;
    edition: number;
    character: string;
    series: string;
    quality: string;
    obtainedDate: Date;  // Cambiado a Date
    burnValue: number;   // Cambiado a number
}; */

type SearchSortProps = {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    sortField: keyof CardData;
    onSortFieldChange: (field: keyof CardData) => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: () => void;
};

export default function SearchSort({
    searchTerm,
    onSearchTermChange,
    sortField,
    onSortFieldChange,
    sortOrder,
    onSortOrderChange,
}: SearchSortProps) {
    return (
        <div className="search-sort">
            <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    ),
                }}
            />
            <FormControl variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortField}
                    onChange={(e) => onSortFieldChange(e.target.value as keyof CardData)}
                    label="Sort By"
                >
                    {/* Opciones del campo de ordenamiento */}
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="edition">Edition</MenuItem>
                    <MenuItem value="character">Character</MenuItem>
                    <MenuItem value="series">Series</MenuItem>
                    <MenuItem value="quality">Quality</MenuItem>
                    <MenuItem value="obtainedDate">Obtained Date</MenuItem>
                    <MenuItem value="burnValue">Burn Value</MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={onSortOrderChange}>
                <SortByAlphaIcon
                    style={{ transform: sortOrder === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }}
                />
            </IconButton>
        </div>
    );
}
