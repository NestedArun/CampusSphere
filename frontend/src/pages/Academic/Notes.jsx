import { useState, useRef } from "react";
import { FileText, Upload, Download, Trash2, Plus, X, BookOpen, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MOCK_NOTES = [
  { id:1, title:"Data Structures - Unit 1 Notes", subject:"Data Structures", type:"notes", uploadedBy:"Dr. Ramesh Kumar", date:"2025-03-10", size:"2.4 MB", tag:"unit1" },
  { id:2, title:"OS Syllabus 2024-25", subject:"Operating Systems", type:"syllabus", uploadedBy:"Prof. Anita Sharma", date:"2025-01-05", size:"180 KB", tag:"syllabus" },
  { id:3, title:"DBMS - ER Diagrams", subject:"DBMS", type:"notes", uploadedBy:"Dr. Pradeep Singh", date:"2025-03-20", size:"1.1 MB", tag:"unit2" },
  { id:4, title:"CN - TCP/IP Reference", subject:"Computer Networks", type:"reference", uploadedBy:"Prof. Meera Iyer", date:"2025-02-14", size:"3.2 MB", tag:"reference" },
  { id:5, title:"ML Syllabus 2024-25", subject:"Machine Learning", type:"syllabus", uploadedBy:"Dr. Vikram Rao", date:"2025-01-08", size:"220 KB", tag:"syllabus" },
];

const TYPE_COLORS = {
  notes:     "bg-accent/10 text-accent border-accent/30",
  syllabus:  "bg-green-500/10 text-green-400 border-green-500/30",
  reference: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

export default function Notes() {
  const { isTeacher, isAdmin } = useAuth();
  const canUpload = isTeacher || isAdmin;
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title:"", subject:"", type:"notes" });
  const [uploading, setUploading] = useState(false);

  const filtered = notes.filter(n => {
    const matchS = n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase());
    const matchT = filterType === "all" || n.type === filterType;
    return matchS && matchT;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setNotes(prev => [{
        id: Date.now(), ...form,
        uploadedBy: "You", date: new Date().toISOString().slice(0,10),
        size: "—", tag: form.type,
      }, ...prev]);
      setShowUpload(false);
      setForm({ title:"", subject:"", type:"notes" });
      setUploading(false);
    }, 800);
  };

  const handleDelete = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={20} className="text-accent" /> Notes & Syllabus
          </h1>
          <p className="text-soft text-sm mt-0.5">{canUpload ? "Upload and manage academic resources" : "Download notes and syllabus"}</p>
        </div>
        {canUpload && (
          <button onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-soft text-white text-sm rounded-xl transition font-medium">
            <Upload size={14} /> Upload
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-primary border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-48 focus-within:border-accent/40 transition">
          <Search size={14} className="text-soft" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
            className="bg-transparent text-sm text-white placeholder-soft/40 outline-none w-full" />
        </div>
        {["all","notes","syllabus","reference"].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border capitalize transition ${filterType===t?"bg-accent border-accent text-white":"border-white/10 text-soft hover:border-accent/40"}`}>{t}</button>
        ))}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-primary border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold flex items-center gap-2"><Upload size={16} className="text-accent"/>Upload Resource</h2>
              <button onClick={() => setShowUpload(false)} className="text-soft hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form,title:e.target.value})} required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-soft/40 outline-none focus:border-accent/60" />
              <input placeholder="Subject" value={form.subject} onChange={e => setForm({...form,subject:e.target.value})} required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-soft/40 outline-none focus:border-accent/60" />
              <select value={form.type} onChange={e => setForm({...form,type:e.target.value})}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent/60">
                <option value="notes">Notes</option>
                <option value="syllabus">Syllabus</option>
                <option value="reference">Reference Material</option>
              </select>
              {/* File input simulation */}
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/40 transition cursor-pointer">
                <Upload size={20} className="mx-auto text-soft mb-2" />
                <p className="text-xs text-soft">Click to select PDF / DOCX / PPT</p>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowUpload(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-soft text-sm hover:bg-white/5 transition">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-soft transition disabled:opacity-50">
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="bg-primary border border-white/10 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-soft flex flex-col items-center gap-2">
            <BookOpen size={32} className="text-soft/30" />
            <p>No resources found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/8 text-soft text-xs">
              <th className="text-left px-5 py-3 font-medium">Title</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Subject</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Uploaded by</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Date</th>
              <th className="px-5 py-3" />
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(n => (
                <tr key={n.id} className="hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{n.title}</p>
                    <p className="text-soft text-xs">{n.size}</p>
                  </td>
                  <td className="px-5 py-3 text-soft hidden md:table-cell">{n.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${TYPE_COLORS[n.type]}`}>{n.type}</span>
                  </td>
                  <td className="px-5 py-3 text-soft text-xs hidden lg:table-cell">{n.uploadedBy}</td>
                  <td className="px-5 py-3 text-soft text-xs hidden lg:table-cell">{n.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button title="Download"
                        className="p-1.5 rounded-lg border border-white/10 text-soft hover:text-accent hover:border-accent/30 transition">
                        <Download size={13} />
                      </button>
                      {canUpload && (
                        <button onClick={() => handleDelete(n.id)} title="Delete"
                          className="p-1.5 rounded-lg border border-white/10 text-soft hover:text-red-400 hover:border-red-500/30 transition">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
