import React from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';
import { CardData } from '../types/CardData'; 
import { Tooltip } from '@mui/material';

type FileUploadProps = {
    onFileUpload: (parsedCards: CardData[]) => void;
};

export default function FileUpload({ onFileUpload }: FileUploadProps) {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    try {
                        const parsedCards = result.data.map((row: any) => ({
                            code: row.code || '',
                            number: row.number || '',
                            edition: row.edition || '',
                            character: row.character || '',
                            series: row.series || '',
                            quality: row.quality || '',
                            obtainedDate: row.obtainedDate || '',
                            burnValue: row.burnValue || '',
                            morphed: row.morphed || '',
                            trimmed: row.trimmed || '',
                            tag: row.tag || '',
                            alias: row.alias || '',
                            wishlists: row.wishlists || [],
                            fights: row.fights || 0,
                            dropQuality: row.dropQuality || '',
                            dropper: row.dropper || '',
                            grabber: row.grabber || '',
                            guild: row.guild || '',
                            worker: {
                                effort: row['worker.effort'] || 0,
                                style: row['worker.style'] || '',
                                grabber: row['worker.grabber'] || '',
                                dropper: row['worker.dropper'] || '',
                                quickness: row['worker.quickness'] || 0,
                                vanity: row['worker.vanity'] || 0,
                                recoveryDate: row['worker.recoveryDate'] || '',
                            }
                        }));
                        onFileUpload(parsedCards);
                    } catch (err) {
                        console.error('Error parsing CSV:', err);
                    }
                },
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
            });
        }
    };

    return (
        <Tooltip title="Descarga tu csv usando el comando k!sheet">            
            <div className="upload-button">
                <input
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileUpload}
                />
                <label htmlFor="raised-button-file">
                    <Button className="button" variant="contained" component="span">
                        <span className="text">
                            <CloudUploadIcon />
                            Upload CSV
                        </span>
                        <div className="wave"></div>
                    </Button>
                </label>
            </div>
        </Tooltip>
    );
}
