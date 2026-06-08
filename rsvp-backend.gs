// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS (do this once)
// ─────────────────────────────────────────────────────────────────────────────
// 1. Go to sheets.google.com and create a new spreadsheet
//    — name it something like "Wedding RSVPs"
//
// 2. In the spreadsheet, click Extensions → Apps Script
//
// 3. Delete everything in the editor and paste ALL of this file in
//
// 4. Click the "Run" button (▶) on the setup() function first
//    — this creates the header row in your sheet
//    — it will ask for permissions, allow everything
//
// 5. Click Deploy → New Deployment
//    — Type: Web App
//    — Execute as: Me
//    — Who has access: Anyone
//    — Click Deploy, copy the Web App URL
//
// 6. Paste that URL into script.js where it says PASTE_YOUR_URL_HERE
//
// 7. That's it! Every YES/NO click will add a row to your spreadsheet.
// ─────────────────────────────────────────────────────────────────────────────

// Run this ONCE to create the header row
function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1, 1, 3).setValues([['Timestamp', 'Guest', 'Response']]);
  sheet.setFrozenRows(1);
  // Bold the header
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
}

// This runs every time someone clicks YES or NO
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const name     = e.parameter.name     || 'Unknown';
    const response = e.parameter.response || 'unknown';

    sheet.appendRow([new Date(), name, response]);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput('Error: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
