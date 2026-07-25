<<<<<<< HEAD
## 📺 Short Demo Video

👉 [Watch the Project Demo Video Here](https://drive.google.com/file/d/1b-nnefhI2vRqjCU8OJOYjv0XhNInfbid/view?usp=drive_link)


## Real-Time Chat App with AI Features

# 🛠️ What We Used to Build It

### Frontend
*   **React & Vite**: For building the UI using functional components.
*   **TypeScript**: To catch errors early and keep data types consistent.
*   **Socket.io-Client**: To connect to the backend and handle live messaging.
*   **Axios**: To make API calls to the backend for the AI features.

### Backend
*   **Node.js & Express**: To handle our server routing and API endpoints.
*   **tsx**: Used to run our TypeScript files directly without manual compilation steps.
*   **MongoDB & Mongoose**: To save all the chat logs and history in a database.
*   **Socket.io**: To handle active connections and broadcast messages instantly to everyone in the chat.
*   **Gemini API Integration**: Uses standard HTTP headers to communicate with Google's AI models.


##  1. Socket Connection Management & Cleanup state Management Approach

To stop the app from slowing down, leaking memory, or creating duplicate event listeners when users move around the app, we manage the socket connection directly inside the component lifecycle using `useEffect`:

```typescript
// Location: frontend/src/components/ChatRoom.tsx

// useEffect(() => {
  // Setup connection when the component loads (Mount)
  // socketRef.current = io('http://localhost:5000');

  // Listen for the database chat history load
  //socketRef.current.on('chat_history', (history: MessageData[]) => {
  //  setMessages(history);
  //});

  // Listen for new incoming messages
 // socketRef.current.on('receive_message', (message: MessageData) => {
  //  setMessages(prev => [...prev, message]);
 // });


### 1. WebSockets & Lifecycle Cleanup
The real-time messaging pipeline is driven by an event-based WebSocket connection. To prevent memory leaks, duplicate message events, or hanging server connections, the socket lifetime is bound strictly to the chat room component's lifecycle:

*   **Connection Persistence (`useRef`)**: We instantiate the socket and assign it to a mutable `useRef` variable (`socketRef.current`). Storing the connection in a reference container ensures it stays alive across multiple render cycles without causing unnecessary screen redraws every time data passes through.
*   **Cleanup Routine (`useEffect`)**: The network connection is managed within a single `useEffect` block configured with an empty dependency array (`[]`), forcing it to run only once when the page loads. 
*   **Tear-Down Phase**: Inside that same hook, we return a cleanup function: `return () => { socketRef.current.disconnect(); }`. The exact moment a user leaves the room or closes the panel, the handshake drops, forcing the server to free up its socket registry immediately.


## 2. State Management Approach


The app uses standard React state (useState) to track changes and keep form inputs completely controlled.

1. messages: An array that holds all the text chats currently on the screen. It updates instantly whenever a new socket message arrives.

2. inputMessage & searchQuery: Simple string states that bind to our input boxes using onChange. This makes React the single source of truth for what the user types.

3. loadingSummary & loadingSearch: Boolean flags used to show loading messages (like "Searching...") and disable buttons so users can't click things twice while waiting for a response.


### AI Prompt Layout  and Summerization

 # Chat Room Summary

 const chatContext = messages.reverse().map(m => `${m.nickname}: ${m.text}`).join('\n');

const prompt = `
  You are a helpful assistant. Summarize the following recent chatroom transcript concisely in a few bullet points:
  
  --- START CHAT LOG TRANSCRIPT ---
  ${chatContext}
  --- END CHAT LOG TRANSCRIPT ---
  
  Provide a highly structured, point-by-point summary outlining core topics discussed and key decisions made. Do not include meta-commentary.
`;

# Chat History Search
const chatContext = messages.reverse().map(m => `[${m.timestamp}] ${m.nickname}: ${m.text}`).join('\n');

const prompt = `
  You are an AI assistant helping a user find information in a chatroom history log.
  
  Here is the available chat log:
  === LOG HISTORY START ===
  ${chatContext}
  === LOG HISTORY END ===
  
  User Query: "${query}"
  
  Answer the user's question accurately using ONLY the information provided in the chat logs above. 
  If the answer cannot be confidently deduced from the transcript logs, explicitly respond with: 
  "I scanned the history logs but found no direct matching mentions."
`;   

----------------------------------------------------------------------------------------------

## AI Usage Disclosure

Here is a quick breakdown of how AI tools were used to help with this project

*   **AI Tools Used**: ChatGPT, Copilot.
*   **Tasks Assisted**: 
    *   **Architecture Planning**: Brainstorming the flow for the local fallback search engine in case the API key fails.
    *   **React Implementation**: Using AI to better understand React component structures, state flow, and how to properly implement hooks.
    *   **Code Suggestions and Genration**: Generating minor utility snippets, like standard regex patterns for text matching.for The core application logic suggestion, backend routes ,Limited strictly to small helper functions and starter syntax templates for the components
    *   **Debugging**: Troubleshooting TypeScript compilation errors and Mongoose schema type mismatches.

=======
## 📺 Short Demo Video

👉 [Watch the Project Demo Video Here](https://drive.google.com/file/d/1b-nnefhI2vRqjCU8OJOYjv0XhNInfbid/view?usp=drive_link)


## Real-Time Chat App with AI Features

# 🛠️ What We Used to Build It

### Frontend
*   **React & Vite**: For building the UI using functional components.
*   **TypeScript**: To catch errors early and keep data types consistent.
*   **Socket.io-Client**: To connect to the backend and handle live messaging.
*   **Axios**: To make API calls to the backend for the AI features.

### Backend
*   **Node.js & Express**: To handle our server routing and API endpoints.
*   **tsx**: Used to run our TypeScript files directly without manual compilation steps.
*   **MongoDB & Mongoose**: To save all the chat logs and history in a database.
*   **Socket.io**: To handle active connections and broadcast messages instantly to everyone in the chat.
*   **Gemini API Integration**: Uses standard HTTP headers to communicate with Google's AI models.


##  1. Socket Connection Management & Cleanup state Management Approach

To stop the app from slowing down, leaking memory, or creating duplicate event listeners when users move around the app, we manage the socket connection directly inside the component lifecycle using `useEffect`:

```typescript
// Location: frontend/src/components/ChatRoom.tsx

// useEffect(() => {
  // Setup connection when the component loads (Mount)
  // socketRef.current = io('http://localhost:5000');

  // Listen for the database chat history load
  //socketRef.current.on('chat_history', (history: MessageData[]) => {
  //  setMessages(history);
  //});

  // Listen for new incoming messages
 // socketRef.current.on('receive_message', (message: MessageData) => {
  //  setMessages(prev => [...prev, message]);
 // });


### 1. WebSockets & Lifecycle Cleanup
The real-time messaging pipeline is driven by an event-based WebSocket connection. To prevent memory leaks, duplicate message events, or hanging server connections, the socket lifetime is bound strictly to the chat room component's lifecycle:

*   **Connection Persistence (`useRef`)**: We instantiate the socket and assign it to a mutable `useRef` variable (`socketRef.current`). Storing the connection in a reference container ensures it stays alive across multiple render cycles without causing unnecessary screen redraws every time data passes through.
*   **Cleanup Routine (`useEffect`)**: The network connection is managed within a single `useEffect` block configured with an empty dependency array (`[]`), forcing it to run only once when the page loads. 
*   **Tear-Down Phase**: Inside that same hook, we return a cleanup function: `return () => { socketRef.current.disconnect(); }`. The exact moment a user leaves the room or closes the panel, the handshake drops, forcing the server to free up its socket registry immediately.


## 2. State Management Approach


The app uses standard React state (useState) to track changes and keep form inputs completely controlled.

1. messages: An array that holds all the text chats currently on the screen. It updates instantly whenever a new socket message arrives.

2. inputMessage & searchQuery: Simple string states that bind to our input boxes using onChange. This makes React the single source of truth for what the user types.

3. loadingSummary & loadingSearch: Boolean flags used to show loading messages (like "Searching...") and disable buttons so users can't click things twice while waiting for a response.


### AI Prompt Layout  and Summerization

 # Chat Room Summary

 const chatContext = messages.reverse().map(m => `${m.nickname}: ${m.text}`).join('\n');

const prompt = `
  You are a helpful assistant. Summarize the following recent chatroom transcript concisely in a few bullet points:
  
  --- START CHAT LOG TRANSCRIPT ---
  ${chatContext}
  --- END CHAT LOG TRANSCRIPT ---
  
  Provide a highly structured, point-by-point summary outlining core topics discussed and key decisions made. Do not include meta-commentary.
`;

# Chat History Search
const chatContext = messages.reverse().map(m => `[${m.timestamp}] ${m.nickname}: ${m.text}`).join('\n');

const prompt = `
  You are an AI assistant helping a user find information in a chatroom history log.
  
  Here is the available chat log:
  === LOG HISTORY START ===
  ${chatContext}
  === LOG HISTORY END ===
  
  User Query: "${query}"
  
  Answer the user's question accurately using ONLY the information provided in the chat logs above. 
  If the answer cannot be confidently deduced from the transcript logs, explicitly respond with: 
  "I scanned the history logs but found no direct matching mentions."
`;   

----------------------------------------------------------------------------------------------

## AI Usage Disclosure

Here is a quick breakdown of how AI tools were used to help with this project

*   **AI Tools Used**: ChatGPT, Copilot.
*   **Tasks Assisted**: 
    *   **Architecture Planning**: Brainstorming the flow for the local fallback search engine in case the API key fails.
    *   **React Implementation**: Using AI to better understand React component structures, state flow, and how to properly implement hooks.
    *   **Code Suggestions and Genration**: Generating minor utility snippets, like standard regex patterns for text matching.for The core application logic suggestion, backend routes ,Limited strictly to small helper functions and starter syntax templates for the components
    *   **Debugging**: Troubleshooting TypeScript compilation errors and Mongoose schema type mismatches.

>>>>>>> 91fee6c3e9bd86c5b3cf2f0a2d22f03a3fc0590a

----------------------------------------------------------------------------------------------------

// How to Setup and Run Locally
//Getting Started & Installation
📋 Prerequisites
Ensure you have Node.js (v18+) and MongoDB installed and running locally on your machine on the default port (27017).

🗄️ 1. Backend Setup
Navigate to the backend directory and install dependencies:

Bash
cd backend
npm install
(Note: If configuring from scratch, install core dependencies and modern TypeScript development tools via:)

npm install express mongoose socket.io cors dotenv axios
npm install -D typescript tsx @types/express @types/node @types/cors
Configure Environment Variables:
Create a .env file inside the root of the backend/ folder:

Environment Variables (backend/.env)
Create a .env file inside the backend folder and add these values:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat-ai
GEMINI_API_KEY=your_gemini_api_key_here
Verify package.json Scripts:
Ensure your backend/package.json contains the tsx run script so it bypasses traditional environment compilation bugs:

JSON
"scripts": {
  "start": "tsx src/server.ts",
  "build": "tsc"
}

Start the backend server:
npm run start


💻 2. Frontend Setup
Open a new, separate terminal window and run the following commands:

Navigate to the frontend directory:

Bash
cd frontend
npm install
npm run dev

Access the Application:
Open your browser and navigate to the local URL displayed in your terminal (typically http://localhost:5173).
