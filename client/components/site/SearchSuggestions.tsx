import React, { useEffect, useState } from "react";

export default function SearchSuggestions({
  query,
  visible,
  onPick,
  max = 5,
}: {
  query: string;
  visible: boolean;
  onPick: (s: string) => void;
  max?: number;
}) {
  const RECENT_KEY = "recent_searches";
  const [val, setVal] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => setVal(query), [query]);

  useEffect(() => {
    if (!visible) { setSuggestions([]); return; }
    if (!val || val.length < 2) { setSuggestions([]); return; }
    let mounted = true;
    const id = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(val)}&limit=${max}`).then(r => r.ok ? r.json() : Promise.reject()).then((d: any) => {
        if (!mounted) return;
        const names = (d.items || []).map((i: any) => i.name).filter(Boolean).slice(0, max);
        setSuggestions(names);
      }).catch(() => setSuggestions([]));
    }, 220);
    return () => { mounted = false; clearTimeout(id); };
  }, [val, visible, max]);

  const clearRecent = () => { try { localStorage.removeItem(RECENT_KEY); setRecent([]); } catch {} };

  return (
    <div className="absolute left-0 right-0 mt-1 z-50 rounded-md border bg-card p-2 shadow">
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <div>Suggestions</div>
        <button className="underline" onMouseDown={(e)=>{e.preventDefault(); clearRecent();}}>Clear</button>
      </div>
      <div className="mt-2 space-y-1">
        {suggestions.map((s) => (
          <button key={s} onMouseDown={(e)=>{e.preventDefault(); onPick(s);}} className="block w-full text-left rounded px-2 py-1 hover:bg-accent">{s}</button>
        ))}
        {recent.length > 0 && (
          <>
            <div className="mt-1 px-2 text-xs text-muted-foreground">Recent</div>
            {recent.map((r) => (
              <button key={r} onMouseDown={(e)=>{e.preventDefault(); onPick(r);}} className="block w-full text-left rounded px-2 py-1 hover:bg-accent">{r}</button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
