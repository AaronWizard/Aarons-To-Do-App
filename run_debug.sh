#!/bin/bash

# Function to kill background processes when you press Ctrl+C
cleanup() {
    echo "Stopping both API and Frontend..."
    kill $(jobs -p) 2>/dev/null
}

# Trap SIGINT (Ctrl+C) and EXIT signals to run the cleanup function
trap cleanup SIGINT EXIT

# Start the API in the background
dotnet run --project "API/AaronsToDoApp.API/AaronsToDoApp.API.csproj" --launch-profile "http" &

# Start the Frontend in the foreground (this keeps the script running)
npm run dev --prefix frontend
