# Airtable MCP Requirements for Empathy Ledger

## What We Need to Fetch

### 1. Storytellers Table
**Filter**: Records where `Project` field contains "Orange Sky Projects"

**Fields needed**:
- `Name` (apply privacy filters based on consent)
- `Project` (to verify Orange Sky tag)
- `Location` (city)
- `Role` (Friend/Volunteer/Staff)
- `Unique Storyteller ID`
- `Consent Status` (Internal/Public/Commercial)
- `Preferred Anonymity Level` (Full Name/Initials/Anonymous)
- `Shifts` (linked records)

### 2. Stories Table
**Filter**: Stories linked to Orange Sky storytellers

**Fields needed**:
- `Story ID`
- `Storyteller` (linked record)
- `Transcript`
- `Themes`
- `Location`
- `Media Type`
- `Collection Date` or created time

### 3. Privacy Rules to Apply

1. **Exclude completely** if:
   - No "Orange Sky Projects" tag
   - Consent Status is missing or "Private"

2. **Include with full details** if:
   - Consent Status is "Public" or "Commercial"
   - Apply anonymity preferences for names

3. **Include anonymously** if:
   - Consent Status is "Internal"
   - Remove all identifying information

## MCP Commands Needed

If your Airtable MCP provides functions like:
- `listBases()` - to find the Empathy Ledger base
- `listTables(baseId)` - to see available tables
- `getRecords(baseId, tableName, options)` - to fetch filtered data

We need to:
1. Get the base ID for Empathy Ledger
2. Fetch Storytellers with Orange Sky filter
3. Fetch Stories linked to those storytellers
4. Apply privacy filtering
5. Save as JSON for static site generation

## Next Steps

1. Use the Airtable MCP in Cursor to:
   - Find the Empathy Ledger base ID
   - Test the filter for Orange Sky Projects records
   - Verify the field names match our expectations

2. Update `fetch-data.js` to use real MCP calls instead of mock data

3. Run the fetch to generate production data files

Would you like to:
1. Share the Airtable base ID so we can document the exact MCP calls?
2. Run the MCP commands in Cursor to test the connection?
3. Show me what MCP functions are available for Airtable?