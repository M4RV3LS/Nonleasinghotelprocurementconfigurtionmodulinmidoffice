import { useState, useMemo, useEffect, useRef } from "react";
import { OrderTable } from "./reports/OrderTable";
import { OrderReport } from "./reports/OrderReport";
import { MOCK_ORDERS, MOCK_VENDORS, Order } from "../mock-data";
import { Button } from "./shared/Button";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  X,
  ChevronDown,
} from "lucide-react";

export function ReportsModule() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState<string[]>(
    [],
  );
  const [vendorFilter, setVendorFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRegionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear region filter when vendor changes
  useEffect(() => {
    setRegionFilter([]);
  }, [vendorFilter]);

  // Get available regions based on selected vendor
  const availableRegions = useMemo(() => {
    if (!vendorFilter) {
      // If no vendor selected, show all regions from orders
      return Array.from(new Set(orders.map((o) => o.propertyRegion)));
    }
    // If vendor selected, show only provinces that vendor serves
    const vendor = MOCK_VENDORS.find((v) => v.id === vendorFilter);
    return vendor ? vendor.provinces : [];
  }, [vendorFilter, orders]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Date Range Filter
      if (
        dateRange.start &&
        new Date(order.createdOn) < new Date(dateRange.start)
      )
        return false;
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59); // Include the end day
        if (new Date(order.createdOn) > endDate) return false;
      }

      // 2. Status Filter
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(order.status)
      )
        return false;

      // 3. Vendor Filter
      if (vendorFilter) {
        const vendor = MOCK_VENDORS.find((v) => v.id === vendorFilter);
        if (vendor && order.vendorName !== vendor.name)
          return false;
      }

      // 4. Region Filter (multiple)
      if (
        regionFilter.length > 0 &&
        !regionFilter.includes(order.propertyRegion)
      )
        return false;

      return true;
    });
  }, [orders, dateRange, statusFilter, vendorFilter, regionFilter]);

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const clearFilters = () => {
    setDateRange({ start: "", end: "" });
    setStatusFilter([]);
    setVendorFilter("");
    setRegionFilter([]);
    setIsRegionDropdownOpen(false);
  };

  const toggleRegion = (region: string) => {
    setRegionFilter((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const selectAllRegions = () => {
    setRegionFilter(availableRegions);
  };

  const clearAllRegions = () => {
    setRegionFilter([]);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header & Global Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900">
              Reports & Analytics
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive view of orders and performance
              metrics
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={clearFilters}
            disabled={
              !dateRange.start &&
              !dateRange.end &&
              !vendorFilter &&
              regionFilter.length === 0 &&
              statusFilter.length === 0
            }
          >
            <X className="w-4 h-4" /> Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Date Range - Now takes 5/12 of the space */}
          <div className="space-y-1 lg:col-span-5">
            <label className="text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#ec2224] focus:border-[#ec2224] min-w-[120px]" 
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    start: e.target.value,
                  })
                }
              />
              <span className="text-gray-400 font-medium">-</span>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#ec2224] focus:border-[#ec2224] min-w-[120px]"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    end: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Vendor Filter - Now takes 2/12 of the space */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Vendor
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#ec2224] focus:border-[#ec2224]"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
            >
              <option value="">All Vendors</option>
              {MOCK_VENDORS.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter - Now takes 3/12 of the space */}
          <div className="space-y-1 lg:col-span-3 relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700">
              Property Region
            </label>
            <button
              type="button"
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#ec2224] focus:border-[#ec2224] flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span
                className={
                  regionFilter.length === 0 ? "text-gray-400" : "text-gray-900"
                }
              >
                {regionFilter.length === 0
                  ? "All Regions"
                  : `${regionFilter.length} region${regionFilter.length > 1 ? "s" : ""} selected`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${isRegionDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isRegionDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="flex gap-2 p-3 border-b border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={selectAllRegions}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={clearAllRegions}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {availableRegions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-2 p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={regionFilter.includes(region)}
                        onChange={() => toggleRegion(region)}
                        className="w-4 h-4 text-[#ec2224] focus:ring-[#ec2224] rounded"
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Filter - Now takes 2/12 of the space */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["requested", "sent", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                      statusFilter.includes(status)
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Order Report (Cards) */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#ec2224]" />
          Order Report Summary
        </h3>
        <OrderReport orders={filteredOrders} />
      </section>

      {/* Section 2: Order Table */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#ec2224]" />
          Detailed Order List
        </h3>
        <OrderTable orders={filteredOrders} />
      </section>
    </div>
  );
}