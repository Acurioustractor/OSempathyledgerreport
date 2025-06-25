/**
 * Test script for fetching Empathy Ledger data
 * Run this in Cursor with Airtable MCP access
 */

// Step 1: Test basic connection and check record counts
console.log("Testing Airtable connection...");

const testConnection = async () => {
  // Test fetching a few storytellers
  const storytellerTest = await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Storytellers",
    filterByFormula: "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')",
    maxRecords: 5
  });
  
  console.log(`\nStorytellers found: ${storytellerTest.records.length}`);
  console.log("Sample storyteller fields:", Object.keys(storytellerTest.records[0]?.fields || {}));
  
  // Test Stories table
  const storiesTest = await mcp.airtable.getRecords({
    baseId: "app7G3Ae65pBblJke",
    tableName: "Stories",
    maxRecords: 5
  });
  
  console.log(`\nStories found: ${storiesTest.records.length}`);
  console.log("Sample story fields:", Object.keys(storiesTest.records[0]?.fields || {}));
  
  // Check if themes exist
  try {
    const themesTest = await mcp.airtable.getRecords({
      baseId: "app7G3Ae65pBblJke",
      tableName: "Themes",
      maxRecords: 5
    });
    console.log(`\nThemes found: ${themesTest.records.length}`);
  } catch (e) {
    console.log("\nThemes table not found or accessible");
  }
};

// Step 2: Full data fetch
console.log("\n=== FULL DATA FETCH ===\n");

const fetchAllData = async () => {
  console.log("Fetching all Orange Sky data...");
  
  const empathyData = {
    storytellers: await mcp.airtable.getRecords({
      baseId: "app7G3Ae65pBblJke",
      tableName: "Storytellers",
      filterByFormula: "OR({Project} = 'Orange Sky', {Project} = 'Orange Sky Projects')"
    }),
    stories: await mcp.airtable.getRecords({
      baseId: "app7G3Ae65pBblJke",
      tableName: "Stories"
    }),
    media: await mcp.airtable.getRecords({
      baseId: "app7G3Ae65pBblJke",
      tableName: "Media"
    }),
    themes: await mcp.airtable.getRecords({
      baseId: "app7G3Ae65pBblJke",
      tableName: "Themes"
    })
  };
  
  console.log("\nData fetched successfully!");
  console.log(`- Storytellers: ${empathyData.storytellers.records.length}`);
  console.log(`- Stories: ${empathyData.stories.records.length}`);
  console.log(`- Media: ${empathyData.media.records.length}`);
  console.log(`- Themes: ${empathyData.themes.records.length}`);
  
  return empathyData;
};

// Step 3: Process the data
const processData = async (empathyData) => {
  // Save raw data for inspection first
  const fs = require('fs');
  const path = require('path');
  
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Save samples for inspection
  fs.writeFileSync(
    path.join(tempDir, 'sample-storyteller.json'),
    JSON.stringify(empathyData.storytellers.records[0], null, 2)
  );
  
  fs.writeFileSync(
    path.join(tempDir, 'sample-story.json'),
    JSON.stringify(empathyData.stories.records[0], null, 2)
  );
  
  console.log("\nSample data saved to temp/ directory for inspection");
  
  // Now process with our script
  const { processEmpathyLedgerData } = require('./process-empathy-ledger-data.js');
  await processEmpathyLedgerData(empathyData);
};

// Run the test
(async () => {
  try {
    // First test connection
    await testConnection();
    
    // Then fetch all data
    const data = await fetchAllData();
    
    // Finally process it
    await processData(data);
    
    console.log("\n✅ Test complete! Check public/data/ for processed files");
  } catch (error) {
    console.error("\n❌ Error during fetch:", error);
  }
})();