/**
 * Script to check Airtable field names and relationships
 * Run this in Cursor to verify the exact field structure
 */

// Commands to run in Cursor with Airtable MCP:

console.log(`
=================================================================
AIRTABLE FIELD VERIFICATION SCRIPT
=================================================================

Run these commands in Cursor to check the exact field names:

// 1. Get a sample storyteller to see all fields
const storytellerSample = await mcp.airtable.getRecords({
  baseId: "app7G3Ae65pBblJke",
  tableName: "Storytellers",
  filterByFormula: "{Project} = 'Orange Sky'",
  maxRecords: 1
});

console.log("Storyteller fields:", Object.keys(storytellerSample.records[0].fields));
console.log("Sample storyteller:", storytellerSample.records[0]);

// 2. Get a sample story to see story fields
const storySample = await mcp.airtable.getRecords({
  baseId: "app7G3Ae65pBblJke",
  tableName: "Stories",
  maxRecords: 1
});

console.log("Story fields:", Object.keys(storySample.records[0].fields));
console.log("Sample story:", storySample.records[0]);

// 3. Check if we have Themes and Shifts tables
const tables = await mcp.airtable.listTables({
  baseId: "app7G3Ae65pBblJke"
});

console.log("Available tables:", tables.tables.map(t => t.name));

=================================================================

EXPECTED FIELDS TO VERIFY:

Storytellers Table:
- Name
- Project (should contain "Orange Sky")
- Location or City
- Role (Friend/Volunteer/Staff)
- Consent Status (Public/Internal/Commercial/Private)
- Preferred Anonymity Level
- Shifts (linked records)
- Any biography/journey field?

Stories Table:
- Storyteller (linked record)
- Transcript or Content
- Themes (linked records or multi-select)
- Location
- Media Type
- Collection Date

Please share:
1. The exact field names from the console output
2. Any fields that don't match our expectations
3. The format of linked records (are they arrays of IDs?)
`);