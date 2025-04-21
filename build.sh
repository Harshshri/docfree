#!/bin/bash

# Create the publish directory if it doesn't exist
mkdir -p public

# Copy all files to the publish directory
cp -r *.html *.css *.js *.json *.yaml public/

echo "Build completed successfully!" 