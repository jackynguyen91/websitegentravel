import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { listAdminCustomers } from "@/lib/admin-customers-fns";
import { TIER_OPTIONS, tierStyle } from "@/lib/customer-tier";
import { formatVND } from "@/lib/format";
import CustomersTable from "@/components/admin/customers/CustomersTable";
import CustomerDrawer from "@/components/admin/customers/CustomerDrawer";

export const Route = createFileRoute("/_authed/admin/customers")({
  head: () => ({ meta: [{ title: "Khách hàng · GenTravel Admin" }] }),
  component: AdminCustomers,
});

const SORTS = [
  { value: "spend-desc", label: "Chi tiêu cao → thấp" },
  { value: "orders-desc", label: "Nhiều đơn nhất" },
  { value: "newest", label: "Khách mới" },
  { value: "name", label: "Tên A → Z" },
];

const selectClass =
  "h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[12.5px] font-medium text-slate-600 outline-none transition focus:border-brand";

function AdminCustomers() {
  const listCustomers = useServerFn(listAdminCustomers);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("spend-desc");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCustomers({
        data: {
          q: debouncedSearch || undefined,
          tier: tier === "all" ? undefined : tier,
          tag: tag === "all" ? undefined : tag,
          sort,
        },
      });
      setData(result);
    } catch (error) {
      toast.error("Không tải được danh sách khách hàng.");
    } finally {
      setLoading(false);
    }
  }, [listCustomers, debouncedSearch, tier, tag, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const tierCounts = data?.tierCounts || {};

  return (
    <div className="space-y-3">
      <header>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink">Khách hàng (CRM)</h1>
        <p className="mt-0.5 text-[12.5px] text-slate-500">
          {data
            ? `${data.total} khách hàng · tổng chi tiêu ${formatVND(data.totals.spend)} · ${data.totals.orders} đơn`
            : "Đang tải hồ sơ khách hàng…"}
        </p>
      </header>

      <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, số điện thoại, email, khu vực…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-ink outline-none focus:border-brand"
            />
          </div>
          <select value={tag} onChange={(event) => setTag(event.target.value)} className={`${selectClass} h-10`} aria-label="Lọc theo thẻ">
            <option value="all">Mọi thẻ</option>
            {(data?.tags || []).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className={`${selectClass} h-10`} aria-label="Sắp xếp khách hàng">
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTier("all")}
            className={`h-8 rounded-lg border px-2.5 text-[12px] font-semibold transition ${
              tier === "all" ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Tất cả ({data?.total ?? 0})
          </button>
          {TIER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTier(option)}
              className={`h-8 rounded-lg border px-2.5 text-[12px] font-semibold transition ${
                tier === option ? "border-brand bg-brand text-white" : `border-slate-200 bg-white ${tierStyle(option).split(" ").slice(1, 2).join(" ")}`
              }`}
            >
              {option} ({tierCounts[option] ?? 0})
            </button>
          ))}
        </div>
      </div>

      <CustomersTable items={data?.items ?? []} onOpen={setDetailId} loading={loading} />

      <CustomerDrawer customerId={detailId} onClose={() => setDetailId(null)} onChanged={load} />
    </div>
  );
}