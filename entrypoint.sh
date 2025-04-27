#!/bin/sh
set -e

if [ ! -z "$VITE_GOOGLE_MAPS_API_KEY" ]; then
  echo "Injecting VITE_GOOGLE_MAPS_API_KEY into frontend files..."

  find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.html' \) -exec sed -i "s|VITE_GOOGLE_MAPS_API_KEY_PLACEHOLDER|$VITE_GOOGLE_MAPS_API_KEY|g" {} +
else
  echo "Warning: VITE_GOOGLE_MAPS_API_KEY is not set!"
fi


exec "$@"
