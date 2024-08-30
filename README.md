
# Karuta Cards Manager: An Overview

Made using:

-React
-TypeScript
-Material-UI (MUI)
-Papaparse
-WebSockets

User Experience: The integration of dark mode and real-time music updates greatly enhances the experience, making it immersive and visually engaging.
Performance: Filtering and sorting are handled efficiently, but performance could be further optimized when dealing with larger datasets by implementing memoization or virtualization techniques.
Future Additions: Adding features such as automated updates of the card data through direct integration with Discord bots or expanding the player to support user playlists could further enrich the functionality.
Overall, Karuta Cards Manager is tailored to cater to Karuta enthusiasts, providing a smooth, engaging way to manage and enjoy their card collections alongside an anime-themed music experience.

Overall, Karuta Cards Manager is tailored to cater to Karuta enthusiasts, providing a smooth, engaging way to manage and enjoy their card collections alongside an anime-themed music experience.
## Features

- CSV Card Data Visualization: Users can upload their Karuta card CSV files to view, filter, and sort their collection. This is achieved through a combination of components such as FileUpload, SearchSort, and CardTable.

- Music Player: Integrated with a WebSocket connection, the app features a music player specifically tailored to stream anime music, providing a thematic background for users.

- Dynamic Filtering and Sorting: Users can filter and sort their cards based on multiple fields like character, series, and obtained date. Sorting is handled dynamically with the ability to switch between ascending and descending orders.

- Dark Mode Toggle: The app supports light and dark themes, allowing users to switch modes for a comfortable viewing experience..

- Card Details and Statistics: Users can click on individual cards to view more details in a modal and access comprehensive statistics about their card collection.

- Error Handling: Errors during data processing are captured and displayed via an ErrorSnackbar, ensuring that issues are communicated clearly to the user.
## 🚀 Instructions to Launch the Application

Follow these steps to set up and run the application locally:

### Prerequisites

Make sure you have installed:

- **Node.js** (version 16 or higher) and npm
- **Git** to clone the repository

### Step 1: Clone the Repository

```bash
git clone https://github.com/Vassa94/KarutaCardsManager
cd KarutaCardsManager
```

### Step 2: Install Dependencies
Install all the necessary dependencies by running:
```bash
npm install
```

### Step 3: Start the Application
Start the application by running:
```bash
npm run dev
```
