"use client";

import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";

// Import Chart.js components and register them
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Barchart(combinedItemData) {
  const chartContainerRef = useRef(null);
  const data = {
    labels: combinedItemData.combinedItemData.map((item) => item.item), // e.g., ['37', '40', '41', ...]
    datasets: [
      {
        label: "Planned",
        data: combinedItemData.combinedItemData.map((item) => item.planned),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Actual",
        data: combinedItemData.combinedItemData.map((item) => item.actual),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Planned Vs Actual (Item Wise)",
      },
    },
  };

  const handleScreenshot = async () => {
    if (!chartContainerRef.current) return;
    try {
      // html2canvas will capture the referenced DOM element
      const canvas = await html2canvas(chartContainerRef.current);
      const imageData = canvas.toDataURL("image/png");

      // Do something with imageData (e.g., open in new tab or send to server)
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<img src="${imageData}" alt="Chart screenshot" />`
        );
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  return (
    <div className="my-10">
      {/* Chart container with a ref for screenshot */}
      <div ref={chartContainerRef} style={{ height: "400px" }}>
        <Bar width={100} data={data} options={options} />
      </div>
      {/* <button onClick={handleScreenshot} style={{ marginTop: "20px" }}>
        Take Screenshot
      </button> */}
    </div>
  );
}
