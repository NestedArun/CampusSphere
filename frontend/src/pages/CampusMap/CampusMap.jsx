import { useState, useEffect } from "react";
import { Map, Search, X, Clock, Users, Wifi, Zap } from "lucide-react";
import { getLocations, seedLocations } from "../../services/campusMapService";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_META = {
  academic: { label: "Academic",  color: "bg-blue-500/20 text-blue-400 border-blue-500/30",    dot: "bg-blue-400" },
  hostel:   { label: "Hostel",    color: "bg-green-500/20 text-green-400 border-green-500/30",  dot: "bg-green-400" },
  admin:    { label: "Admin",     color: "bg-purple-500/20 text-purple-400 border-purple-500/30", dot: "bg-purple-400" },
  lab:      { label: "Lab",       color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
  sports:   { label: "Sports",    color: "bg-orange-500/20 text-orange-400 border-orange-500/30", dot: "bg-orange-400" },
  medical:  { label: "Medical",   color: "bg-red-500/20 text-red-400 border-red-500/30",        dot: "bg-red-400" },
  food:     { label: "Food",      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",     dot: "bg-pink-400" },
  other:    { label: "Other",     color: "bg-gray-500/20 text-gray-400 border-gray-500/30",     dot: "bg-gray-400" },
};

const CATEGORIES = ["all", "academic", "hostel", "lab", "admin", "sports", "medical", "food"];

export default function CampusMap() {
  const { isAdmin } = useAuth();
  const [locations, setLocations]       = useState([]);
  const [selected, setSelected]         = useState(null);
  const [filter, setFilter]             = useState("all");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [seeding, setSeeding]           = useState(false);

  useEffect(() => {
    getLocations().then((res) => setLocations(res.data.locations)).finally(() => setLoading(false));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const res = await seedLocations();
    const fresh = await getLocations();
    setLocations(fresh.data.locations);
    setSeeding(false);
  };

  const filtered = locations.filter((l) => {
    const matchCat = filter === "all" || l.category === filter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.code?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Build grid (10 cols x 8 rows)
  const COLS = 10; const ROWS = 8;
  const grid = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) =>
      filtered.find((l) => l.gridX === c + 1 && l.gridY === r + 1) || null
    )
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Map size={20} className="text-accent" /> Campus Map</h1>
          <p className="text-soft text-sm mt-0.5">VIT Vellore — Interactive Campus Navigator</p>
        </div>
        {isAdmin && locations.length === 0 && (
          <button onClick={handleSeed} disabled={seeding}
            className="px-3 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm hover:bg-accent/30 transition disabled:opacity-50">
            {seeding ? "Seeding..." : "Seed Locations"}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-accent/40 transition">
          <Search size={13} className="text-soft" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search location..."
            className="bg-transparent text-sm text-white outline-none placeholder-soft/50 w-36" />
        </div>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition ${
              filter === cat ? "bg-accent border-accent text-white" : "border-white/10 text-soft hover:border-accent/40 hover:text-white"
            }`}>{cat}</button>
        ))}
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Map Grid */}
        <div className="flex-1 bg-primary border border-white/10 rounded-xl p-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-soft">Loading map...</div>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                {Object.entries(CATEGORY_META).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${val.dot}`} />
                    <span className="text-xs text-soft">{val.label}</span>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="border border-white/10 rounded-lg overflow-hidden" style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, minmax(60px, 1fr))` }}>
                {grid.flat().map((loc, i) => {
                  const row = Math.floor(i / COLS);
                  const col = i % COLS;
                  const meta = loc ? CATEGORY_META[loc.category] : null;
                  const isSelected = selected?._id === loc?._id;
                  return (
                    <div key={i}
                      onClick={() => loc && setSelected(isSelected ? null : loc)}
                      className={`aspect-square flex flex-col items-center justify-center p-1 border border-white/5 text-center transition-all cursor-pointer
                        ${loc ? "hover:bg-white/10" : ""}
                        ${isSelected ? "ring-2 ring-accent ring-inset bg-accent/10" : ""}
                        ${row % 2 === 0 ? "bg-background/40" : "bg-background/20"}
                      `}>
                      {loc ? (
                        <>
                          <span className={`w-2.5 h-2.5 rounded-full mb-0.5 ${meta?.dot}`} />
                          <span className="text-white text-[9px] font-bold leading-tight">{loc.code}</span>
                        </>
                      ) : (
                        <span className="text-white/5 text-[8px]">·</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-soft mt-2 text-center">Click a block to see details</p>
            </>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:w-72 space-y-3">
          {selected ? (
            <div className="bg-primary border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded border capitalize font-medium ${CATEGORY_META[selected.category]?.color}`}>{selected.category}</span>
                  <h2 className="text-white font-bold mt-1">{selected.name}</h2>
                  <p className="text-soft text-xs">{selected.code}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-soft hover:text-white"><X size={16} /></button>
              </div>
              <div className="px-4 py-3 space-y-3">
                {selected.description && <p className="text-soft text-sm">{selected.description}</p>}
                <div className="space-y-2">
                  {selected.timings && (
                    <div className="flex items-center gap-2 text-xs text-soft">
                      <Clock size={13} className="text-accent" />{selected.timings}
                    </div>
                  )}
                  {selected.capacity && (
                    <div className="flex items-center gap-2 text-xs text-soft">
                      <Users size={13} className="text-accent" />Capacity: {selected.capacity}
                    </div>
                  )}
                </div>
                {selected.facilities?.length > 0 && (
                  <div>
                    <p className="text-xs text-soft mb-1.5">Facilities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.facilities.map((f) => (
                        <span key={f} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-soft">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-primary border border-white/10 rounded-xl px-4 py-6 text-center text-soft text-sm">
              <Map size={24} className="mx-auto mb-2 text-soft/40" />
              Click any building on the map to see details
            </div>
          )}

          {/* Location list */}
          <div className="bg-primary border border-white/10 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            <div className="px-4 py-2.5 border-b border-white/10 text-xs text-soft font-medium">{filtered.length} locations</div>
            {filtered.map((l) => {
              const meta = CATEGORY_META[l.category];
              return (
                <div key={l._id} onClick={() => setSelected(selected?._id === l._id ? null : l)}
                  className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition border-b border-white/5 ${selected?._id === l._id ? "bg-accent/10" : ""}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${meta?.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{l.name}</p>
                    <p className="text-xs text-soft">{l.code} · {l.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
