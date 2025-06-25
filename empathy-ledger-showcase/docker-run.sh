#!/bin/bash

# Docker helper script for Empathy Ledger Showcase

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo "Usage: ./docker-run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev       - Start development server with hot reload"
    echo "  prod      - Start production server"
    echo "  build     - Build production image"
    echo "  stop      - Stop all containers"
    echo "  logs      - Show container logs"
    echo "  shell     - Open shell in container"
    echo "  clean     - Remove containers and images"
    echo "  fetch     - Fetch latest data from Airtable"
    echo ""
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

case "$1" in
    dev)
        echo -e "${BLUE}Starting development server...${NC}"
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    prod)
        echo -e "${BLUE}Starting production server...${NC}"
        docker-compose up --build
        ;;
    build)
        echo -e "${BLUE}Building production image...${NC}"
        docker-compose build
        ;;
    stop)
        echo -e "${BLUE}Stopping containers...${NC}"
        docker-compose -f docker-compose.dev.yml down
        docker-compose down
        ;;
    logs)
        echo -e "${BLUE}Showing logs...${NC}"
        docker-compose -f docker-compose.dev.yml logs -f
        ;;
    shell)
        echo -e "${BLUE}Opening shell in container...${NC}"
        docker-compose -f docker-compose.dev.yml exec empathy-ledger-dev sh
        ;;
    clean)
        echo -e "${RED}Cleaning up containers and images...${NC}"
        docker-compose -f docker-compose.dev.yml down --rmi all --volumes
        docker-compose down --rmi all --volumes
        ;;
    fetch)
        echo -e "${BLUE}Fetching latest data from Airtable...${NC}"
        docker-compose -f docker-compose.dev.yml exec empathy-ledger-dev npm run fetch-data
        ;;
    *)
        show_usage
        ;;
esac