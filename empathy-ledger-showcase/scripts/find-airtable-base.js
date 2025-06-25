/**
 * Script to find the Empathy Ledger base ID using Airtable MCP
 * Run this in an environment where Airtable MCP is available
 */

// Step 1: List all bases to find Empathy Ledger
async function findEmpathyLedgerBase() {
  console.log('Looking for Empathy Ledger base...\n');
  
  // If using Airtable MCP, the command might look like:
  // const bases = await mcp.airtable.listBases();
  
  // Look for a base with name containing "Empathy Ledger"
  // The response might look like:
  /*
  {
    bases: [
      {
        id: "appXXXXXXXXXXXXXX",
        name: "Empathy Ledger",
        permissionLevel: "create"
      }
    ]
  }
  */
  
  console.log('Expected MCP command: mcp.airtable.listBases()');
  console.log('Look for base with name "Empathy Ledger"');
  console.log('Note the base ID (starts with "app")');
}

// Step 2: List tables in the Empathy Ledger base
async function listEmpathyLedgerTables(baseId) {
  console.log(`\nListing tables in base ${baseId}...\n`);
  
  // Command might be:
  // const tables = await mcp.airtable.listTables({ baseId });
  
  console.log('Expected tables:');
  console.log('- Storytellers');
  console.log('- Stories');
  console.log('- Themes');
  console.log('- Shifts');
}

// Step 3: Test fetching Orange Sky records
async function testOrangeSkyFilter(baseId) {
  console.log('\nTesting Orange Sky Projects filter...\n');
  
  // The MCP command might look like:
  /*
  const records = await mcp.airtable.getRecords({
    baseId: baseId,
    tableName: "Storytellers",
    filter: "{Project} = 'Orange Sky Projects'",
    maxRecords: 5
  });
  */
  
  console.log('Expected MCP command:');
  console.log(`mcp.airtable.getRecords({
    baseId: "${baseId}",
    tableName: "Storytellers",
    filter: "{Project} = 'Orange Sky Projects'",
    maxRecords: 5
  })`);
}

// Output instructions
console.log(`
Airtable Base Discovery Instructions
====================================

1. In your Cursor environment with Airtable MCP:
   - Run the MCP command to list all bases
   - Find the base named "Empathy Ledger"
   - Copy the base ID (format: appXXXXXXXXXXXXXX)

2. Verify the tables exist:
   - List tables in the Empathy Ledger base
   - Confirm you see: Storytellers, Stories, Themes, Shifts

3. Test the Orange Sky filter:
   - Try fetching a few Storytellers records
   - Use filter: {Project} = 'Orange Sky Projects'
   - Verify you get results

4. Once confirmed, update the .env.local file:
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

Please run these commands in Cursor and share:
- The base ID
- Confirmation that the Orange Sky filter returns records
- Any field name differences from our expectations
`);

// Export for use in other scripts
module.exports = {
  findEmpathyLedgerBase,
  listEmpathyLedgerTables,
  testOrangeSkyFilter
};