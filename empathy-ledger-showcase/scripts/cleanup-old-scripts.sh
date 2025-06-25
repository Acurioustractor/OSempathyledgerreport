#!/bin/bash

# Archive old scripts instead of deleting them
echo "📁 Creating archive directory..."
mkdir -p scripts/archive

echo "📦 Moving old scripts to archive..."

# Move old versions
mv scripts/data-processing-v*.js scripts/archive/ 2>/dev/null
mv scripts/fetch-data.js scripts/archive/ 2>/dev/null
mv scripts/fetch-direct.js scripts/archive/ 2>/dev/null
mv scripts/fetch-empathy-ledger-data.js scripts/archive/ 2>/dev/null
mv scripts/process-airtable-data.js scripts/archive/ 2>/dev/null
mv scripts/process-empathy-ledger-data.js scripts/archive/ 2>/dev/null
mv scripts/test-fetch.js scripts/archive/ 2>/dev/null
mv scripts/mcp-fetch-commands.js scripts/archive/ 2>/dev/null
mv scripts/fetch-data-with-mcp.js scripts/archive/ 2>/dev/null

echo "✅ Cleanup complete! Old scripts moved to scripts/archive/"
echo "💡 You can safely delete the archive folder after verifying everything works."