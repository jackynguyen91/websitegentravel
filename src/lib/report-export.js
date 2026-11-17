import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { formatVND } from "@/lib/format";

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function exportCsv(filename, headers, rows) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escape).join(";")).join("\r\n");
  const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Xuất PDF bằng cách render bảng ra canvas để giữ đúng tiếng Việt có dấu. */
export async function exportPdf({ filename, title, subtitle, columns, rows, summary = [], landscape = true }) {
  const node = document.createElement("div");
  node.style.cssText =
    "position:fixed;left:-10000px;top:0;width:1123px;padding:40px;background:#ffffff;color:#0f172a;font-family:Arial,Helvetica,sans-serif;font-size:12px;";
  const head = columns.map((col) => `<th style="padding:7px 9px;border:1px solid #e2e8f0;background:#f1f5f9;text-align:left;">${esc(col)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td style="padding:6px 9px;border:1px solid #eef2f7;">${esc(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  node.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0F766E;padding-bottom:12px;">
      <div>
        <div style="font-size:21px;font-weight:800;color:#0F766E;">GenTravel</div>
        <div style="font-size:11px;color:#64748b;">Mạng lưới bán tour trong nước &amp; quốc tế</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:15px;font-weight:700;">${esc(title)}</div>
        <div style="font-size:11px;color:#64748b;">${esc(subtitle)}</div>
      </div>
    </div>
    ${
      summary.length
        ? `<div style="display:flex;gap:10px;margin-top:16px;">${summary
            .map(
              (item) =>
                `<div style="flex:1;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">${esc(item.label)}</div><div style="font-size:14px;font-weight:700;margin-top:2px;">${esc(item.value)}</div></div>`,
            )
            .join("")}</div>`
        : ""
    }
    <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:11.5px;">
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
    <div style="margin-top:16px;font-size:10.5px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:8px;">
      Báo cáo được xuất tự động từ hệ thống quản trị GenTravel · ${esc(new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }))}
    </div>
  `;
  document.body.appendChild(node);
  try {
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
    const image = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: landscape ? "landscape" : "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = pageWidth / canvas.width;
    const height = canvas.height * ratio;
    let remaining = height;
    let offset = 0;
    while (remaining > 0) {
      pdf.addImage(image, "JPEG", 0, -offset, pageWidth, height);
      remaining -= pageHeight;
      offset += pageHeight;
      if (remaining > 0) pdf.addPage();
    }
    pdf.save(filename);
  } finally {
    node.remove();
  }
}

export const reportSummaryText = (summary) => summary.map((item) => `${item.label}: ${item.value}`).join(" · ");

export const vnd = formatVND;