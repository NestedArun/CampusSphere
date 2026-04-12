import { useState, useEffect, useRef } from "react";
import { MapPin, Bus, Search, X, Clock, Users, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { seedLocations } from "../../services/campusMapService";

const VIT = [12.9698, 79.1559];

const CAMPUS_LOCATIONS = [
  { name:"Technology Tower",      code:"TT",  cat:"academic", lat:12.9710, lng:79.1570, desc:"Main academic block with lecture halls", timings:"8AM–8PM", capacity:2000, facilities:["Wi-Fi","AC","Projectors"] },
  { name:"Silver Jubilee Tower",  code:"SJT", cat:"academic", lat:12.9720, lng:79.1560, desc:"Engineering & science departments",      timings:"8AM–8PM", capacity:3000, facilities:["Wi-Fi","Labs","Seminar Halls"] },
  { name:"Computational Lab",     code:"CL",  cat:"lab",      lat:12.9705, lng:79.1548, desc:"Computer labs with 300 PCs",             timings:"24 Hours",capacity:500,  facilities:["300 PCs","Wi-Fi"] },
  { name:"Main Library",          code:"LIB", cat:"academic", lat:12.9715, lng:79.1545, desc:"Central library with digital resources", timings:"8AM–10PM",capacity:800,  facilities:["80k+ Books","Study Rooms"] },
  { name:"Men's Hostel Block A",  code:"MHA", cat:"hostel",   lat:12.9685, lng:79.1565, desc:"On-campus residential — male students", timings:"24 Hours",capacity:400,  facilities:["Wi-Fi","Gym","Laundry"] },
  { name:"Women's Hostel Block",  code:"WHB", cat:"hostel",   lat:12.9675, lng:79.1555, desc:"On-campus residential — female students",timings:"24 Hours",capacity:400,  facilities:["Wi-Fi","Mess","Security"] },
  { name:"Admin Block",           code:"AB",  cat:"admin",    lat:12.9725, lng:79.1550, desc:"Admissions, registrar & admin offices", timings:"9AM–5PM", capacity:100,  facilities:["Finance","Student Affairs"] },
  { name:"Student Amenity Centre",code:"SAC", cat:"food",     lat:12.9695, lng:79.1540, desc:"Food court, ATM, shops",               timings:"7AM–11PM",capacity:600,  facilities:["Food Court","ATM","Salon"] },
  { name:"Health Centre",         code:"HC",  cat:"medical",  lat:12.9680, lng:79.1535, desc:"24/7 medical facility",               timings:"24 Hours",capacity:50,   facilities:["Doctor","Pharmacy","Ambulance"] },
  { name:"Sports Complex",        code:"SC",  cat:"sports",   lat:12.9672, lng:79.1545, desc:"Indoor & outdoor sports facilities",  timings:"6AM–9PM", capacity:1000, facilities:["Cricket","Swimming Pool","Gym"] },
  { name:"Mechanical Block",      code:"MB",  cat:"lab",      lat:12.9690, lng:79.1530, desc:"Mechanical & civil engineering workshops",timings:"8AM–6PM",capacity:300,facilities:["Workshop","CNC","3D Printers"] },
  { name:"Banking & Finance",     code:"BFB", cat:"academic", lat:12.9700, lng:79.1538, desc:"Business school & finance dept",      timings:"8AM–7PM", capacity:500,  facilities:["Trading Lab","Seminar Hall"] },
];

const BUS_ROUTES = [
  { id:"R1", name:"Main Gate Loop",  color:"#5483B3", coords:[[12.9698,79.1559],[12.9710,79.1570],[12.9720,79.1560],[12.9715,79.1545],[12.9705,79.1535],[12.9695,79.1540],[12.9688,79.1552],[12.9690,79.1565],[12.9698,79.1559]] },
  { id:"R2", name:"Hostel Circuit",  color:"#7DA0CA", coords:[[12.9698,79.1559],[12.9685,79.1565],[12.9675,79.1558],[12.9672,79.1545],[12.9680,79.1535],[12.9690,79.1530],[12.9700,79.1538],[12.9705,79.1550],[12.9698,79.1559]] },
  { id:"R3", name:"Academic Block",  color:"#C1E8FF", coords:[[12.9698,79.1559],[12.9708,79.1548],[12.9718,79.1540],[12.9725,79.1550],[12.9720,79.1565],[12.9710,79.1570],[12.9700,79.1572],[12.9695,79.1563],[12.9698,79.1559]] },
];

const CAT_COLOR = {
  academic:"#5483B3", hostel:"#4ade80", admin:"#a78bfa",
  lab:"#facc15", sports:"#fb923c", medical:"#f87171",
  food:"#f472b6", other:"#94a3b8",
};
const CAT_BADGE = {
  academic:"bg-blue-500/15 text-blue-400 border-blue-500/30",
  hostel:  "bg-green-500/15 text-green-400 border-green-500/30",
  admin:   "bg-purple-500/15 text-purple-400 border-purple-500/30",
  lab:     "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  sports:  "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medical: "bg-red-500/15 text-red-400 border-red-500/30",
  food:    "bg-pink-500/15 text-pink-400 border-pink-500/30",
  other:   "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

function lerp(a, b, t) { return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }

const initBuses = () => BUS_ROUTES.map((r, i) => ({
  id:`BUS-${101+i}`, routeId:r.id, routeName:r.name, color:r.color,
  seg: i % (r.coords.length-1), t: i*0.3, speed:0.016+i*0.004,
  pos: r.coords[i % r.coords.length],
}));

const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export default function CampusMap() {
  const { isAdmin } = useAuth();
  const mapDiv    = useRef(null);
  const mapInst   = useRef(null);
  const busLayers = useRef({});

  const [leafletReady, setLeafletReady] = useState(false);
  const [activeTab,    setActiveTab]    = useState("map");
  const [selected,     setSelected]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");
  const [buses,        setBuses]        = useState(initBuses);
  const [seeding,      setSeeding]      = useState(false);

  // Load Leaflet CSS + JS from CDN
  useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.js";
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Init map
  useEffect(() => {
    if (!leafletReady || !mapDiv.current || mapInst.current) return;
    const L = window.L;
    const map = L.map(mapDiv.current, {
      center: VIT, zoom: 16, minZoom: 15, maxZoom: 19,
      zoomControl: false, attributionControl: false,
    });
    L.tileLayer(DARK_TILES, { subdomains:"abcd", maxZoom:20 }).addTo(map);
    L.control.zoom({ position:"bottomright" }).addTo(map);

    // Draw bus route polylines
    BUS_ROUTES.forEach(r => {
      L.polyline(r.coords, { color:r.color, weight:3, opacity:0.55, dashArray:"6,4" }).addTo(map);
    });

    // Campus location markers
    CAMPUS_LOCATIONS.forEach(loc => {
      const color = CAT_COLOR[loc.cat] || "#94a3b8";
      const icon = L.divIcon({
        className:"",
        html:`<div style="width:28px;height:28px;border-radius:8px;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${color};font-family:monospace">${loc.code}</div>`,
        iconSize:[28,28], iconAnchor:[14,14],
      });
      L.marker([loc.lat, loc.lng], { icon }).addTo(map).on("click", () => setSelected(loc));
    });

    // Bus markers
    initBuses().forEach(bus => {
      const icon = L.divIcon({
        className:"",
        html:`<div style="width:22px;height:22px;border-radius:50%;background:${bus.color};border:2px solid #021024;display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 0 8px ${bus.color}80">🚌</div>`,
        iconSize:[22,22], iconAnchor:[11,11],
      });
      busLayers.current[bus.id] = L.marker(bus.pos, { icon, zIndexOffset:1000 }).addTo(map);
    });

    mapInst.current = map;
  }, [leafletReady]);

  // Animate buses every 200ms
  useEffect(() => {
    const id = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const route = BUS_ROUTES.find(r => r.id === bus.routeId);
        let { seg, t } = bus;
        t += bus.speed;
        if (t >= 1) { t = 0; seg = (seg+1) % (route.coords.length-1); }
        const pos = lerp(route.coords[seg], route.coords[seg+1], t);
        busLayers.current[bus.id]?.setLatLng(pos);
        return { ...bus, seg, t, pos };
      }));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const focusLocation = (loc) => {
    setSelected(loc);
    mapInst.current?.panTo([loc.lat, loc.lng], { animate:true });
  };

  const focusBus = (bus) => mapInst.current?.panTo(bus.pos, { animate:true });

  const handleSeed = async () => {
    setSeeding(true);
    try { await seedLocations(); } catch {}
    setSeeding(false);
  };

  const filteredLocs = CAMPUS_LOCATIONS.filter(l => {
    const matchCat = catFilter === "all" || l.cat === catFilter;
    const matchQ   = l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col gap-3" style={{height:"calc(100vh - 3.5rem - 2.5rem)"}}>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin size={20} className="text-accent" /> Campus Map & Bus Tracker
          </h1>
          <p className="text-soft text-xs mt-0.5">VIT Vellore · OpenStreetMap · Live Bus Simulation</p>
        </div>
        {isAdmin && (
          <button onClick={handleSeed} disabled={seeding}
            className="px-3 py-1.5 rounded-xl text-xs border border-white/10 text-soft hover:text-accent hover:border-accent/30 transition disabled:opacity-40">
            {seeding ? "Seeding..." : "Seed DB"}
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-1 min-h-0">

        {/* Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-3 min-h-0">

          {/* Tab toggle */}
          <div className="flex bg-primary border border-white/10 rounded-xl p-1 gap-1">
            {[["map","Locations",MapPin],["bus","Buses",Bus]].map(([id,label,Icon]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition ${activeTab===id?"bg-accent text-white":"text-soft hover:text-white"}`}>
                <Icon size={12}/>{label}
              </button>
            ))}
          </div>

          {activeTab === "map" ? (
            <>
              {/* Search */}
              <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-xl px-3 py-2 focus-within:border-accent/40 transition">
                <Search size={13} className="text-soft shrink-0"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="bg-transparent text-xs text-white outline-none w-full placeholder-soft/40"/>
                {search && <button onClick={() => setSearch("")}><X size={12} className="text-soft"/></button>}
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-1">
                {["all","academic","hostel","lab","admin","sports","medical","food"].map(c => (
                  <button key={c} onClick={() => setCatFilter(c)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border capitalize transition ${catFilter===c?"bg-accent border-accent text-white":"border-white/10 text-soft hover:border-accent/30"}`}>{c}</button>
                ))}
              </div>

              {/* Location list */}
              <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
                {filteredLocs.map(loc => (
                  <div key={loc.code} onClick={() => focusLocation(loc)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${selected?.code===loc.code?"border-accent/40 bg-accent/8":"border-white/5 bg-primary hover:bg-white/5"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[9px] font-bold"
                        style={{background:`${CAT_COLOR[loc.cat]}20`,color:CAT_COLOR[loc.cat],border:`1px solid ${CAT_COLOR[loc.cat]}40`}}>
                        {loc.code.slice(0,2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium truncate">{loc.name}</p>
                        <p className="text-soft text-[10px] capitalize">{loc.cat}</p>
                      </div>
                      {selected?.code===loc.code && <ChevronRight size={12} className="text-accent shrink-0"/>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Bus tab */
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              <div className="space-y-1.5">
                {BUS_ROUTES.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary border border-white/10">
                    <span className="w-4 h-0.5 rounded-full" style={{background:r.color}}/>
                    <span className="text-xs text-soft flex-1">{r.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-soft/60 px-1 pt-1">Active Buses</p>
              {buses.map(bus => (
                <div key={bus.id} onClick={() => focusBus(bus)}
                  className="px-3 py-2.5 rounded-xl bg-primary border border-white/10 cursor-pointer hover:border-accent/30 transition">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                      style={{background:`${bus.color}20`,border:`1px solid ${bus.color}40`}}>🚌</div>
                    <div>
                      <p className="text-white text-xs font-bold">{bus.id}</p>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft"/>
                        <span className="text-[10px] text-green-400">Live</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-soft mb-1.5">{bus.routeName}</p>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-200"
                      style={{width:`${bus.t*100}%`,background:bus.color}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 min-h-0">
          <div ref={mapDiv} className="w-full h-full" style={{minHeight:"400px"}}/>

          {!leafletReady && (
            <div className="absolute inset-0 bg-primary flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"/>
                <p className="text-sm text-soft">Loading map...</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-3 left-3 glass rounded-xl px-3 py-2.5 pointer-events-none z-[999]">
            <p className="text-[10px] font-semibold text-soft/60 uppercase tracking-wider mb-1.5">Categories</p>
            {Object.entries(CAT_COLOR).map(([k,v]) => (
              <div key={k} className="flex items-center gap-1.5 text-[10px] text-soft capitalize">
                <span className="w-2 h-2 rounded-sm" style={{background:v+"40",border:`1px solid ${v}`}}/>
                {k}
              </div>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2">
              {BUS_ROUTES.map(r => (
                <div key={r.id} className="flex items-center gap-1.5 text-[10px] text-soft">
                  <span className="w-4 h-0.5 rounded" style={{background:r.color}}/>
                  {r.id} — {r.name}
                </div>
              ))}
            </div>
          </div>

          {/* Selected location card */}
          {selected && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-80 glass rounded-2xl p-4 z-[999]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${CAT_BADGE[selected.cat]}`}>{selected.cat}</span>
                  <h3 className="text-white font-bold text-sm mt-1">{selected.name}</h3>
                  <p className="text-soft text-xs">{selected.code}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-soft hover:text-white"><X size={14}/></button>
              </div>
              <p className="text-soft text-xs mb-2">{selected.desc}</p>
              <div className="flex flex-wrap gap-3 text-[10px] text-soft mb-2">
                <span className="flex items-center gap-1"><Clock size={10}/>{selected.timings}</span>
                <span className="flex items-center gap-1"><Users size={10}/>Cap: {selected.capacity}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.facilities?.map(f => (
                  <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-soft">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .leaflet-container { background:#021024 !important; }
        .leaflet-control-zoom a { background:#052659 !important; color:#7DA0CA !important; border-color:rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a:hover { background:#0a3070 !important; color:white !important; }
      `}</style>
    </div>
  );
}