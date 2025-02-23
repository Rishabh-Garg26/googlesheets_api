import Dashboard from "@/component/Dashsboard";
import { getSheetData } from "@/lib/googleSheets";

// 1. Set how often you want Next.js to revalidate (fetch fresh data) in seconds.
//    For example, 43200 seconds = 12 hours.
export const revalidate = 10;

// 2. This component is a Server Component by default (no "use client" at the top).
//    You can fetch data directly here using your custom utility.
export default async function DashboardPage({ searchParams }) {
  // Example: fetch data from Google Sheets
  const sheetId = process.env.SHEET_ID;
  const range = "Sheet1!A1:R"; // adjust as needed
  const rows = await getSheetData(sheetId, range);
  // Function to safely parse searchParams
  const parseParam = (param) => {
    if (!param) return [];
    return Array.isArray(param) ? param : param.split(",");
  };

  // Ensure searchParams is correctly accessed
  const selectedProjects = parseParam((await searchParams)?.selectedProjects);
  const selectedSupervisors = parseParam(
    (await searchParams)?.selectedSupervisors
  );
  const selectedDepts = parseParam((await searchParams)?.selectedDepts);
  const selectedItems = parseParam((await searchParams)?.selectedItems);
  const selectedDateRange = parseParam((await searchParams)?.date);

  // Transform rows as needed for your charts
  const sheetData = rows.map((row) => row._rawData); // Collect all raw data
  // console.log(sheetData);

  // Get unique project names
  const uniqueProjectNames = [...new Set(sheetData.map((item) => item[3]))];
  const uniqueSupervisors = [...new Set(sheetData.map((item) => item[0]))];
  const uniqueDepts = [...new Set(sheetData.map((item) => item[13]))];
  const uniqueItems = [...new Set(sheetData.map((item) => item[2]))];

  // Filter the sheet data based on the query parameters if provided
  let filteredData = sheetData;
  if (selectedProjects.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedProjects.includes(item[3])
    );
  }
  if (selectedSupervisors.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedSupervisors.includes(item[0])
    );
  }
  if (selectedDepts.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedDepts.includes(item[13])
    );
  }
  if (selectedItems.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedItems.includes(item[2])
    );
  }

  if (selectedDateRange.length > 0) {
    filteredData = filteredData.filter(
      (item) => new Date(selectedDateRange[0]) <= new Date(item[5])
    );
  }

  const weekWiseData = filteredData.reduce((acc, row) => {
    // Group key from the 5th column (index 4)
    const groupKey = row[4];

    // Convert the 9th (index 8) and 11th (index 10) column values to numbers
    const value9 = parseFloat(row[8]) || 0;
    const value11 = parseFloat(row[10]) || 0;

    // If this group doesn't exist yet, initialize it
    if (!acc[groupKey]) {
      acc[groupKey] = {
        week: groupKey,
        planned: 0,
        actual: 0,
      };
    }

    // Add the current row's values to the group totals
    acc[groupKey].planned += value9;
    acc[groupKey].actual += value11;
    return acc;
  }, {});

  // Convert the grouping object into an array for graphing or further processing
  const combinedWeekData = Object.values(weekWiseData).map((item) => ({
    ...item,
    planned: Number(item.planned.toFixed(2)),
    actual: Number(item.actual.toFixed(2)),
  }));

  const itemWiseData = filteredData.reduce((acc, row) => {
    // Group key from the 5th column (index 4)
    const groupKey = row[2];

    // Convert the 9th (index 8) and 11th (index 10) column values to numbers
    const value9 = parseFloat(row[8]) || 0;
    const value11 = parseFloat(row[10]) || 0;

    // If this group doesn't exist yet, initialize it
    if (!acc[groupKey]) {
      acc[groupKey] = {
        item: groupKey,
        planned: 0,
        actual: 0,
      };
    }

    // Add the current row's values to the group totals
    acc[groupKey].planned += value9;
    acc[groupKey].actual += value11;
    return acc;
  }, {});

  // Convert the grouping object into an array for graphing or further processing
  const combinedItemData = Object.values(itemWiseData).map((item) => ({
    ...item,
    planned: Number(item.planned.toFixed(2)),
    actual: Number(item.actual.toFixed(2)),
  }));

  const dayWiseData = filteredData.reduce((acc, row) => {
    // Group key from the 5th column (index 4)
    const groupKey = row[5];

    // Convert the 9th (index 8) and 11th (index 10) column values to numbers
    const value9 = parseFloat(row[8]) || 0;
    const value11 = parseFloat(row[10]) || 0;

    // If this group doesn't exist yet, initialize it
    if (!acc[groupKey]) {
      acc[groupKey] = {
        date: groupKey,
        planned: 0,
        actual: 0,
      };
    }

    // Add the current row's values to the group totals
    acc[groupKey].planned += value9;
    acc[groupKey].actual += value11;
    return acc;
  }, {});

  // Convert the grouping object into an array for graphing or further processing
  const combinedDayData = Object.values(dayWiseData).map((item) => ({
    ...item,
    planned: Number(item.planned.toFixed(2)),
    actual: Number(item.actual.toFixed(2)),
  }));

  return (
    <main className="p-8">
      <h1 className=" text-4xl md:text-6xl justify-self-center p-10">
        Dashboard 2024
      </h1>
      <Dashboard
        uniqueProjectNames={uniqueProjectNames}
        uniqueSupervisors={uniqueSupervisors}
        uniqueDepts={uniqueDepts}
        uniqueItems={uniqueItems}
        combinedWeekData={combinedWeekData}
        combinedItemData={combinedItemData}
        combinedDayData={combinedDayData}
      />
    </main>
  );
}
