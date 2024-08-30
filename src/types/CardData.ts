// src/types/CardData.ts
export type CardData = {
    code: string;
    number: number;
    edition: number;
    character: string;
    series: string;
    quality: string;
    obtainedDate: Date;
    burnValue: number;
    // Otras columnas que no se deben mostrar en la tabla
    morphed?: string;
    trimmed?: string;
    tag?: string;
    alias?: string;
    wishlists?: string;
    fights?: string;
    dropQuality?: string;
    dropper?: string;
    grabber?: string;
    guild?: string;
    worker: {
        effort?: string;
        style?: string;
        grabber?: string;
        dropper?: string;
        quickness?: string;
        vanity?: string;
        recoveryDate?: Date;
    };
};
