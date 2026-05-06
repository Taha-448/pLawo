#!/bin/bash

echo "=========================================="
echo "  pLawo - MERN Stack Setup (Linux/Mac)"
echo "=========================================="
echo ""

echo "[1/3] Installing Backend dependencies..."
cd backend || exit
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Backend installation failed."
    exit 1
fi
cd ..

echo ""
echo "[2/3] Installing Frontend dependencies..."
cd frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Frontend installation failed."
    exit 1
fi
cd ..

echo ""
echo "[3/3] Finalizing..."
echo ""
echo "=========================================="
echo "  INSTALLATION COMPLETE!"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo "1. Update the .env files in both /backend and /frontend."
echo "2. Run 'npm run dev' in both folders to start the project."
echo "3. Run 'node scripts/createAdmin.js' in /backend to create your admin."
echo ""
