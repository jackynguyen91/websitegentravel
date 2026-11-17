export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(rows, filename, columns) {
  const header = columns.map((column) => column.label).join(",");
  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = typeof column.value === "function" ? column.value(row) : row[column.value];
        const text = value === null || value === undefined ? "" : String(value);
        return `"${text.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  const blob = new Blob([`\uFEFF${[header, ...body].join("\n")}`], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export async function exportNodeAsPng(node, filename) {
  if (!node) return;
  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(node, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `${filename}.png`);
  });
}