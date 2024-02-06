#!/bin/bash

# Initialize the server with necessary files and folders

# Variables
env=$1

# Echo statements
echo "Initializing the server with necessary files and folders"

# Fetching zip file from server
echo "Fetching zip file from server"
wget "http://home.kumarsomesh.in/v3/file?token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhvbWUubXBiZHAiLCJpZCI6MSwiaXNzIjoiY2FzYW9zIiwiZXhwIjoxNzA3MjQ5NzMwLCJuYmYiOjE3MDcyMzg5MzAsImlhdCI6MTcwNzIzODkzMH0.VTTsvNJftqeQA0VfBhWf802kuVWGze8IxdSEGAHd2Sq36boEL7ogYnLLd1dOC-toBjtWWYr0HVgRMveY7Ifhqg&path=%2Fvar%2Flib%2Fplexmediaserver%2FSeagate%2Fuploads.zip"

# Unzipping the file
echo "Unzipping the file"
unzip uploads.zip

# Create uploads folder
#echo "Creating uploads folder"
#mkdir uploads

#echo "Creating subfolders inside uploads folder"
#mkdir uploads/bases uploads/bases/introduction uploads/blogs uploads/projects uploads/updates
# Runs the server
echo "Installing dependencies"
npm install

if [[ "$env" == "d" || "$env" == "dev" ]]
then
    echo "Running in development mode"
    # echo "Setting up the type for development mode"
    # sed -i "${line_number}s/.*/${dev_type}/" "$file"
    # npm run dev
else
    echo "Running in production mode"
    # echo "Setting up the type for production mode"
    # sed -i "${line_number}s/.*/${prod_type}/" "$file"
    # npm run run_babel
fi
