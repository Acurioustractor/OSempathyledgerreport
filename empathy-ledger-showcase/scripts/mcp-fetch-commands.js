/**
 * MCP Commands to run in Cursor with Airtable MCP
 * Base: Empathy Ledger (app7G3Ae65pBblJke)
 */

// Step 1: Fetch Orange Sky Storytellers
const storytellers = await mcp.airtable.getRecords({
  baseId: "app7G3Ae65pBblJke",
  tableName: "Storytellers",
  filterByFormula: "{Project} = 'Orange Sky'"
});

console.log(`Found ${storytellers.records.length} Orange Sky storytellers`);

// Step 2: Fetch all Stories (we'll filter by storyteller later)
const stories = await mcp.airtable.getRecords({
  baseId: "app7G3Ae65pBblJke",
  tableName: "Stories"
});

console.log(`Found ${stories.records.length} total stories`);

// Step 3: Get the first few storytellers to check field structure
console.log("Sample storyteller fields:", storytellers.records[0]?.fields);

// Step 4: Process and save the data
// Copy the processAndSaveData function from fetch-empathy-ledger-data.js
// Then run: processAndSaveData(storytellers.records, stories.records);