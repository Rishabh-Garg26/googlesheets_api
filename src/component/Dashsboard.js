"use client";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Barchart from "./BarchartWeekly";
import BarchartItem from "./BarchartItem";
import BarchartDay from "./BarchartDay";
import HashLoader from "react-spinners/HashLoader";

export default function Dashboard({
  uniqueProjectNames,
  uniqueSupervisors,
  uniqueDepts,
  uniqueItems,
  combinedWeekData,
  combinedItemData,
  combinedDayData,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [date, setDate] = useState({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(2024, 0, 1), 20),
  });

  // Create state for each menu
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);

  // Helper function to toggle selection
  const toggleSelection = (item, selected, setSelected, checked) => {
    if (checked) {
      setSelected([...selected, item]);
    } else {
      setSelected(selected.filter((i) => i !== item));
    }
  };

  // When the "Filter Data" button is clicked, update the URL with query parameters.
  const handleFilter = () => {
    const params = new URLSearchParams();
    if (selectedProjects.length) {
      params.append("selectedProjects", selectedProjects.join(","));
    }
    if (selectedSupervisors.length) {
      params.append("selectedSupervisors", selectedSupervisors.join(","));
    }
    if (selectedDepts.length) {
      params.append("selectedDepts", selectedDepts.join(","));
    }
    if (selectedItems.length) {
      params.append("selectedItems", selectedItems.join(","));
    }
    if (date.from && date.to) {
      params.append(
        "date",
        `${date.from.toISOString()},${date.to.toISOString()}`
      );
    }
    // Use startTransition to mark the navigation as a transition
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const override = {
    display: "block",
    borderColor: "red",
    marginTop: "15vh",
  };

  return (
    <main className="container mx-auto px-4 w-full">
      <div className="flex flex-col p-4">
        {/* Filter Controls */}
        <div className="justify-center flex flex-col sm:flex-row gap-4">
          {/* Date Range Picker */}
          <span className="p-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-muted-foreground"
                >
                  <CalendarIcon className="mr-2" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </span>

          {/* Project Name Dropdown */}
          <span className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Project Name
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {uniqueProjectNames.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item}
                    onSelect={(event) => event.preventDefault()}
                    checked={selectedProjects.includes(item)}
                    onCheckedChange={(checked) =>
                      toggleSelection(
                        item,
                        selectedProjects,
                        setSelectedProjects,
                        checked
                      )
                    }
                  >
                    {item}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>

          {/* Dept. Name Dropdown */}
          <span className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Dept. Name
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {uniqueDepts.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item}
                    onSelect={(event) => event.preventDefault()}
                    checked={selectedDepts.includes(item)}
                    onCheckedChange={(checked) =>
                      toggleSelection(
                        item,
                        selectedDepts,
                        setSelectedDepts,
                        checked
                      )
                    }
                  >
                    {item}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>

          {/* Item Name Dropdown */}
          <span className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Item Name
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {uniqueItems.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item}
                    onSelect={(event) => event.preventDefault()}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={(checked) =>
                      toggleSelection(
                        item,
                        selectedItems,
                        setSelectedItems,
                        checked
                      )
                    }
                  >
                    {item}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>

          {/* Supervisors Dropdown */}
          <span className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Supervisors
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {uniqueSupervisors.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item}
                    onSelect={(event) => event.preventDefault()}
                    checked={selectedSupervisors.includes(item)}
                    onCheckedChange={(checked) =>
                      toggleSelection(
                        item,
                        selectedSupervisors,
                        setSelectedSupervisors,
                        checked
                      )
                    }
                  >
                    {item}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </span>

          {/* Filter Button */}
          <span className="p-3 ">
            <Button
              variant="destructive"
              onClick={handleFilter}
              className="w-full"
            >
              Filter Data
            </Button>
          </span>
        </div>
      </div>

      {/* Selected Filters Section */}
      <div className="mt-4 w-full">
        {selectedProjects.length > 0 && (
          <div>
            <span className="font-semibold block">Projects:</span>
            <div className="displayF">
              {selectedProjects.map((item) => (
                <div
                  key={item}
                  className="displayG items-center bg-blue-100 text-blue-700 rounded-full px-2 py-1"
                >
                  <span>{item}</span>
                  <button
                    onClick={() =>
                      setSelectedProjects(
                        selectedProjects.filter((p) => p !== item)
                      )
                    }
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDepts.length > 0 && (
          <div>
            <span className="font-semibold">Depts:</span>
            <div className="displayF">
            {selectedDepts.map((item) => (
              <div
                key={item}
                className="displayG items-center bg-blue-100 text-blue-700 rounded-full px-2 py-1"
              >
                <span className="break-words">{item}</span>
                <button
                  onClick={() =>
                    setSelectedDepts(selectedDepts.filter((d) => d !== item))
                  }
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  &times;
                </button>
              </div>
            ))}
            </div>
          </div>
        )}
        {selectedItems.length > 0 && (
          <div>
            <span className="font-semibold">Items:</span>
            <div className="displayF">
            {selectedItems.map((item) => (
              <div
                key={item}
                className="displayG items-center bg-blue-100 text-blue-700 rounded-full px-2 py-1"
              >
                <span className="break-words">{item}</span>
                <button
                  onClick={() =>
                    setSelectedItems(selectedItems.filter((i) => i !== item))
                  }
                  className="ml-1 text-yellow-500 hover:text-yellow-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          </div>
        )}
        {selectedSupervisors.length > 0 && (
          <div>
            <span className="font-semibold">Supervisors:</span>
            <div className="displayF">
            {selectedSupervisors.map((item) => (
              <div
                key={item}
                className="displayG items-center bg-blue-100 text-blue-700 rounded-full px-2 py-1"
              >
                <span className="break-words">{item}</span>
                <button
                  onClick={() =>
                    setSelectedSupervisors(
                      selectedSupervisors.filter((s) => s !== item)
                    )
                  }
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Loader or Charts */}
      {isPending ? (
        <div className="flex justify-center items-center">
          <HashLoader
            color={"#0398fc"}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="mt-8">
            <Barchart combinedWeekData={combinedWeekData} />
          </div>
          <div className="my-28">
            <BarchartItem combinedItemData={combinedItemData} />
          </div>
          <div className="mb-8">
            <BarchartDay combinedDayData={combinedDayData} />
          </div>
        </>
      )}
    </main>
  );
}
