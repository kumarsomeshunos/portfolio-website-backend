#!/bin/bash

# Initialize the server with necessary files and folders

# Variables
env=$1

# Echo statements
echo "Initializing the server with necessary files and folders"

# Create uploads folder
echo "Creating uploads folder"
mkdir uploads

echo "Creating subfolders inside uploads folder"
mkdir uploads/bases uploads/bases/introduction uploads/blogs uploads/projects uploads/updates
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
