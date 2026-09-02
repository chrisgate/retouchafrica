#!/bin/sh
set -e

echo "Seeding placeholder upload assets..."
mkdir -p public/uploads
cp -rn public/seed-uploads/* public/uploads/

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec node server.js
