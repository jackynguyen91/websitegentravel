import { useState } from "react";
import { Clock3, Loader2, StickyNote } from "lucide-react";
import { formatDateVN } from "@/lib/format";

const TYPE_STYLE = {
  status: "bg-sky-500",
  payment: "bg-emerald-500",
  email: "bg-violet-500",
  note: "bg-amber-500",
  created: "bg-slate-400",
};

export default function BookingNotesTimeline({ booking, onAddNote, busy }) {
  const [text, setText] = useState("");
  const notes = [...(booking.internal_notes || [])].reverse();
  const activities = [...(booking.activities || [])].reverse();

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    const ok = await onAddNote(text.trim());
    if (ok) setText("");
  };

  return (
    <>
      <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          <StickyNote className="h-3.5 w-3.5" /> Ghi chú nội bộ
        </h3>
        <form onSubmit={submit} className="mt-2 space-y-1.5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={2}
            placeholder="Ví dụ: khách yêu cầu phòng 2 giường, gọi lại sau 18h…"
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12.5px] text-ink outline-none transition focus:border-brand"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy === "note" || !text.trim()}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-ink px-3 text-[12px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {busy === "note" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Lưu ghi chú
            </button>
          </div>
        </form>
        {notes.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {notes.map((note, index) => (
              <li key={`${note.at}-${index}`} className="rounded-lg bg-amber-50/60 px-2.5 py-1.5">
                <p className="text-[12px] text-slate-700">{note.text}</p>
                <p className="mt-0.5 text-[10.5px] text-slate-400">
                  {note.author || "Quản trị viên"} · {formatDateVN(note.at, true)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">
        <h3 className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          <Clock3 className="h-3.5 w-3.5" /> Lịch sử hoạt động
        </h3>
        <ol className="mt-2.5 space-y-2.5">
          {activities.length === 0 && <li className="text-[12px] text-slate-400">Chưa có hoạt động nào.</li>}
          {activities.map((activity, index) => (
            <li key={`${activity.at}-${index}`} className="relative flex gap-2.5 pl-1">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_STYLE[activity.type] || "bg-slate-400"}`} />
              <div className="min-w-0">
                <p className="text-[12px] leading-snug text-slate-700">{activity.text}</p>
                <p className="text-[10.5px] text-slate-400">{formatDateVN(activity.at, true)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}