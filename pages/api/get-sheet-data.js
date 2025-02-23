import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export default async function handler(req, res) {
  const { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SHEET_ID } =
    process.env;

  if (
    !GOOGLE_PRIVATE_KEY ||
    !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !GOOGLE_SHEET_ID
  ) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    );
    // Load the document and the first sheet
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const sheetData = rows.map((row) => row._rawData); // Collect all raw data

    return rows;
  } catch (error) {
    console.error("Error accessing Google Sheet:", error);
    res.status(500).json({ error: "Failed to fetch sheet data" });
  }
}
