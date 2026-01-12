#!/bin/bash

# Script to ensure local Supabase is running before e2e tests – start it if needed

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking if local Supabase is running...${NC}"

# Check if Supabase is running by checking the API port
if command -v curl > /dev/null 2>&1; then
  if curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Local Supabase is already running${NC}"
    exit 0
  fi
fi

# Alternative: Check using supabase status command
if command -v supabase > /dev/null 2>&1; then
  if supabase status 2>/dev/null | grep -q "API URL"; then
    echo -e "${GREEN}✓ Local Supabase is already running${NC}"
    exit 0
  fi
fi

echo -e "${YELLOW}Local Supabase is not running. Starting it...${NC}"

# Start Supabase
supabase start

# Wait for Supabase to be ready
echo -e "${YELLOW}Waiting for Supabase to be ready...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Local Supabase is ready!${NC}"
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 1
done

echo -e "${RED}✗ Failed to start Supabase or it's taking too long to start${NC}"
exit 1

