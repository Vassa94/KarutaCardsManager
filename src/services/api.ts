declare const require: any;

export async function fetchCharacterImage(
    characterName: string
): Promise<string | null> {
    // Crear un contexto de requerimiento para cargar imágenes desde la carpeta local
    const imagesContext = require.context(
        "../assets/images/cards",
        false,
        /\.(png|jpe?g|gif)$/i
    );

    // Obtener todas las rutas de los archivos en la carpeta
    const allImages: string[] = imagesContext.keys();

    // Convertir el nombre del personaje a minúsculas para comparar
    const characterNameLower = characterName.toLowerCase();

    // Buscar un archivo que coincida con el nombre del personaje
    const matchedImage = allImages.find((imagePath: string) => {
        const fileName = imagePath
            .split("/")
            .pop()
            ?.split(".")
            .shift()
            ?.toLowerCase();
        return fileName === characterNameLower;
    });

    if (matchedImage) {
        // Si se encuentra una coincidencia, devolver la ruta de la imagen local
        return imagesContext(matchedImage);
    } else {
        console.warn("No local image found for character:", characterName);
        return null; // Indicar que no se encontró la imagen
    }
}

export function createMusicWebSocket(onTrackUpdate: (track: any) => void) {
    const wsUrl = "wss://listen.moe/gateway_v2"; // Puedes cambiar a 'wss://listen.moe/kpop/gateway_v2' si es necesario
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("WebSocket connection opened.");
        ws.send(JSON.stringify({ op: 9 })); // Enviar el latido del corazón para mantener la conexión
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.op === 1 && data.t === "TRACK_UPDATE") {
            onTrackUpdate(data.d.song);
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed.");
    };

    return ws;
}
