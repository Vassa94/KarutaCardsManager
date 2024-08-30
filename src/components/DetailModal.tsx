import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CardData } from '../types/CardData';

type DetailModalProps = {
    open: boolean;
    onClose: () => void;
    card: CardData;
};

export default function DetailModal({ open, onClose, card }: DetailModalProps) {
    //const [imageSrc, setImageSrc] = useState<string>('');

    /* useEffect(() => {
        if (card.code) {
            const imagePath = new URL(`../assets/img/cards/${card.code}.png`, import.meta.url).href;
            //setImageSrc(imagePath);
        }
    }, [card.code]); */

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Card Details</DialogTitle>
            <DialogContent>
                <div>
                    <p><strong>Code:</strong> {card.code}</p>
                    <p><strong>Number:</strong> {card.number}</p>
                    <p><strong>Edition:</strong> {card.edition}</p>
                    <p><strong>Character:</strong> {card.character}</p>
                    <p><strong>Series:</strong> {card.series}</p>
                    <p><strong>Quality:</strong> {card.quality}</p>
                    <p><strong>Obtained Date:</strong> {card.obtainedDate.toLocaleDateString()}</p>
                    <p><strong>Burn Value:</strong> {card.burnValue}</p>
                    {/* Mostrar la imagen del personaje */}
                    {/* {imageSrc && <img src={imageSrc} alt={card.character} style={{ maxWidth: '100%', maxHeight: '300px' }} />} */}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
