# KarutaCardsManager

## 📝 Descripción
KarutaCardsManager es una aplicación web moderna diseñada para gestionar y organizar cartas Karuta. Desarrollada con React y TypeScript, ofrece una interfaz intuitiva y funcional para los entusiastas de Karuta.

## 🚀 Características
- Interfaz de usuario moderna y responsive con Material-UI
- Gestión eficiente de cartas Karuta
- Soporte para importación/exportación de datos CSV
- Sistema de filtrado y búsqueda avanzada
- Integración con Firebase para almacenamiento y autenticación

## 🛠️ Tecnologías
- **Frontend:** React 18
- **Lenguaje:** TypeScript
- **UI Framework:** Material-UI (MUI) v6
- **Backend/Hosting:** Firebase
- **Bundler:** Vite
- **Gestión de Paquetes:** PNPM
- **Procesamiento de Datos:** PapaParse
- **Linting:** ESLint

## 📁 Estructura del Proyecto
```
KarutaCardsManager/
├── src/                    # Código fuente principal
│   ├── assets/            # Recursos estáticos
│   ├── components/        # Componentes React reutilizables
│   ├── contexts/          # Contextos de React
│   ├── services/          # Servicios y lógica de negocio
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── public/                # Archivos públicos estáticos
├── build/                 # Archivos compilados
└── firebase.json         # Configuración de Firebase
```

## 🚦 Requisitos Previos
- Node.js (versión recomendada: >=16)
- PNPM
- Cuenta de Firebase (para funcionalidades de backend)

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd KarutaCardsManager
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto y añadir las variables necesarias para Firebase.

4. Iniciar el servidor de desarrollo:
```bash
pnpm dev
```

## 📜 Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Compila el proyecto para producción
- `pnpm lint`: Ejecuta el linter
- `pnpm preview`: Vista previa de la build de producción

## 🔧 Configuración

### Firebase
1. Crear un proyecto en Firebase Console
2. Habilitar los servicios necesarios (Authentication, Firestore, etc.)
3. Copiar las credenciales de configuración
4. Actualizar la configuración en el archivo de configuración de Firebase

### Variables de Entorno
Crear un archivo `.env` con las siguientes variables:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 🤝 Contribución
Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

Link del proyecto: [https://karutacardsmanager.web.app](https://karutacardsmanager.web.app)
