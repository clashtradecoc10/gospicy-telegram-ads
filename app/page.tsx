"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TelegramAdsResponse, TelegramAdItem } from "./types";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<TelegramAdsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  useEffect(() => {
    const fetchTelegramAds = async () => {
      try {
        const response = await fetch("/api/telegram-ads");
        const data = await response.json();
        setApiResponse(data);
        console.log("Telegram Ads API Response:", data);
      } catch (error) {
        console.error("Error fetching Telegram Ads:", error);
        setApiResponse({ success: false, error: "Failed to fetch" });
      } finally {
        setLoading(false);
      }
    };

    fetchTelegramAds();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "in review":
        return "text-amber-600";
      case "rejected":
        return "text-red-600";
      case "paused":
        return "text-gray-500";
      default:
        return "text-gray-600";
    }
  };

  const formatValue = (value: number | false | null) => {
    if (value === false || value === null) return "–";
    return value;
  };

  const formatCurrency = (value: number | false | null) => {
    if (value === false || value === null) return "–";
    return `$${value.toFixed(2)}`;
  };

  const formatCurrencyWithIcon = (value: number | false | null) => {
    if (value === false || value === null) return "–";
    return (
      <span className="flex items-center gap-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block"
        >
          <path
            id="icon-currency-ton"
            d="m2.68 4h10.63c.22 0 .4.18.4.41 0 .07-.01.14-.05.2l-5.04 9.08c-.22.4-.72.54-1.11.32-.14-.08-.25-.19-.32-.33l-4.87-9.08c-.1-.2-.03-.45.17-.55.06-.03.12-.05.19-.05zm5.32 9.78v-9.78z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        {value.toFixed(2)}
      </span>
    );
  };

  const formatPercentage = (value: number | false | null) => {
    if (value === false || value === null) return "–";
    return `${value}%`;
  };

  const extractStartParam = (tmePath: string) => {
    if (!tmePath) return "–";
    const match = tmePath.match(/\?start=(.+)/);
    return match ? match[1] : "–";
  };

  const extractTargetFromTitle = (title: string) => {
    if (!title) return "–";
    const parts = title.split(" - ");
    return parts.length > 1 ? parts[1] : "–";
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortValue = (
    item: TelegramAdItem,
    column: string
  ): string | number => {
    switch (column) {
      case "target":
        return extractTargetFromTitle(item.title);
      case "param":
        return extractStartParam(item.tme_path);
      case "views":
        return item.views ?? 0;
      case "clicks":
        return item.clicks ?? 0;
      case "starts":
        return item.actions ?? 0;
      case "ctr":
        return item.ctr === false || item.ctr === null ? 0 : item.ctr;
      case "cpm":
        return item.cpm ?? 0;
      case "spent":
        return item.spent ?? 0;
      case "budget":
        return item.budget ?? 0;
      case "target2":
        return item.target || "";
      case "status":
        return item.status || "";
      default:
        return "";
    }
  };

  const sortedItems = apiResponse?.data?.items
    ? [...apiResponse.data.items].sort((a, b) => {
        if (!sortColumn || !sortDirection) return 0;

        const aValue = getSortValue(a, sortColumn);
        const bValue = getSortValue(b, sortColumn);

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      })
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading ads...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white text-gray-600 text-left text-xs uppercase">
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("target")}
                >
                  <div className="flex items-center gap-1">
                    Target
                    <div className="flex flex-col">
                      {sortColumn === "target" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "target" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("param")}
                >
                  <div className="flex items-center gap-1">
                    Param
                    <div className="flex flex-col">
                      {sortColumn === "param" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "param" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("views")}
                >
                  <div className="flex items-center gap-1">
                    Views
                    <div className="flex flex-col">
                      {sortColumn === "views" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "views" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("clicks")}
                >
                  <div className="flex items-center gap-1">
                    Clicks
                    <div className="flex flex-col">
                      {sortColumn === "clicks" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "clicks" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("starts")}
                >
                  <div className="flex items-center gap-1">
                    Starts
                    <div className="flex flex-col">
                      {sortColumn === "starts" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "starts" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("ctr")}
                >
                  <div className="flex items-center gap-1">
                    CTR
                    <div className="flex flex-col">
                      {sortColumn === "ctr" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "ctr" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("cpm")}
                >
                  <div className="flex items-center gap-1">
                    CPM
                    <div className="flex flex-col">
                      {sortColumn === "cpm" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "cpm" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("spent")}
                >
                  <div className="flex items-center gap-1">
                    Spent
                    <div className="flex flex-col">
                      {sortColumn === "spent" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "spent" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("budget")}
                >
                  <div className="flex items-center gap-1">
                    Budget
                    <div className="flex flex-col">
                      {sortColumn === "budget" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "budget" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("target2")}
                >
                  <div className="flex items-center gap-1">
                    Target
                    <div className="flex flex-col">
                      {sortColumn === "target2" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "target2" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
                <th
                  className="px-4 py-1.5 font-bold cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <div className="flex flex-col">
                      {sortColumn === "status" && sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                      {sortColumn === "status" && sortDirection === "desc" ? (
                        <ChevronDown className="w-3 h-3 opacity-100" />
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item: TelegramAdItem, index: number) => (
                <tr
                  key={item.ad_id}
                  className={index % 2 === 0 ? "bg-[#f1f4f6]" : "bg-white"}
                >
                  <td className="px-4 py-1.5 text-gray-700">
                    {extractTargetFromTitle(item.title)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {extractStartParam(item.tme_path)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatValue(item.views)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatValue(item.clicks)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {item.actions ?? 0}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatPercentage(item.ctr)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatCurrencyWithIcon(item.cpm)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatCurrencyWithIcon(item.spent)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">
                    {formatCurrencyWithIcon(item.budget)}
                  </td>
                  <td className="px-4 py-1.5 text-gray-700">{item.target}</td>
                  <td className="px-4 py-1.5">
                    <span
                      className={`font-medium ${getStatusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">No ads found</div>
          )}
        </div>
      </div>
    </div>
  );
}
