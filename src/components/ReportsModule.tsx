import { useState, useMemo } from "react";
import { OrderTable } from "./reports/OrderTable";
import { OrderReport } from "./reports/OrderReport";
import { MOCK_ORDERS, Order } from "../mock-data";
import { Button } from "./shared/Button";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";

export function ReportsModule() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  // Filter States
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState<string[]>(
    [],
  );
  const [regionFilter, setRegionFilter] = useState("");

  // Extract unique regions for filter dropdown
  const regions = useMemo(
    () =>
      Array.from(new Set(orders.map((o) => o.propertyRegion))),
    [orders],
  );

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

      // 3. Region Filter
      if (regionFilter && order.propertyRegion !== regionFilter)
        return false;

      return true;
    });
  }, [orders, dateRange, statusFilter, regionFilter]);

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
    setRegionFilter("");
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
              !regionFilter &&
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

          {/* Region Filter - Now takes 3/12 of the space */}
          <div className="space-y-1 lg:col-span-3">
            <label className="text-sm font-medium text-gray-700">
              Property Region
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#ec2224] focus:border-[#ec2224]"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter - Now takes 4/12 of the space */}
          <div className="space-y-1 lg:col-span-4">
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