import { useState } from "react";
import { BarChart2, ChevronDown, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SUBJECTS = ["Data Structures","Operating Systems","DBMS","Computer Networks","Software Engineering","Machine Learning"];
const STUDENTS_MOCK = [
  { id:"22BCE1001", name:"Aarav Sharma",  scores:[82,74,90,68,85,79] },
  { id:"22BCE1002", name:"Priya Nair",    scores:[91,88,95,82,90,87] },
  { id:"22BCE1003", name:"Rahul Mehta",   scores:[65,70,58,72,60,55] },
  { id:"22BCE1004", name:"Sneha Pillai",  scores:[78,82,76,80,74,88] },
  { id:"22BCE1005", name:"Arjun Reddy",   scores:[88,92,85,95,90,93] },
];

const gradeOf = (s) => s>=90?"O":s>=80?"A+":s>=70?"A":s>=60?"B+":s>=50?"B":"F";
const gradeColor = (s) => s>=80?"text-green-400":s>=60?"text-yellow-400":"text-red-400";

// My marks (student mock)
const MY_MARKS = SUBJECTS.map((s, i) => ({ subject: s, internal: [72,68,80][i%3], external: [75,82,70][i%3] }));

export default function Marks() {
  const { isTeacher, isAdmin } = useAuth();
  const canEdit = isTeacher || isAdmin;
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [scores, setScores] = useState({});

  const handleScoreChange = (id, idx, val) => {
    setScores(prev => ({ ...prev, [`${id}-${idx}`]: val }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 size={20} className="text-accent" /> Marks
          </h1>
          <p className="text-soft text-sm mt-0.5">{canEdit ? "View and update student marks" : "Your academic performance"}</p>
        </div>
        {canEdit && (
          <button onClick={() => setEditMode(v=>!v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${editMode?"bg-accent border-accent text-white":"border-white/10 text-soft hover:border-accent/40 hover:text-white"}`}>
            {editMode ? "Done Editing" : "Edit Marks"}
          </button>
        )}
      </div>

      {canEdit ? (
        <div className="bg-primary border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
          <div className="px-5 py-3 border-b border-white/8 flex items-center gap-3">
            <span className="text-sm font-semibold text-white">All Students — Marks Sheet</span>
            {editMode && <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/30">Edit Mode</span>}
          </div>
          <table className="w-full text-sm min-w-[800px]">
            <thead><tr className="border-b border-white/8 text-soft text-xs">
              <th className="text-left px-5 py-3 font-medium">Student</th>
              {SUBJECTS.map(s => <th key={s} className="text-center px-3 py-3 font-medium">{s.slice(0,6)}..</th>)}
              <th className="text-center px-5 py-3 font-medium">Avg</th>
              <th className="text-center px-5 py-3 font-medium">Grade</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {STUDENTS_MOCK.map(st => {
                const displayScores = SUBJECTS.map((_,i) => parseInt(scores[`${st.id}-${i}`] ?? st.scores[i]) || 0);
                const avg = Math.round(displayScores.reduce((a,b)=>a+b,0)/displayScores.length);
                return (
                  <tr key={st.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium text-xs">{st.name}</p>
                      <p className="text-soft text-[10px] font-mono">{st.id}</p>
                    </td>
                    {displayScores.map((score, i) => (
                      <td key={i} className="px-3 py-3 text-center">
                        {editMode ? (
                          <input type="number" min={0} max={100}
                            defaultValue={score}
                            onChange={e => handleScoreChange(st.id, i, e.target.value)}
                            className="w-14 bg-background border border-white/10 rounded-lg px-2 py-1 text-xs text-white text-center outline-none focus:border-accent/60" />
                        ) : (
                          <span className={`text-xs font-semibold ${gradeColor(score)}`}>{score}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-center"><span className={`text-xs font-bold ${gradeColor(avg)}`}>{avg}</span></td>
                    <td className="px-5 py-3 text-center"><span className={`text-xs font-bold ${gradeColor(avg)}`}>{gradeOf(avg)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[["CGPA","8.4","text-green-400"],["This Sem","8.1","text-accent"],["Rank","12 / 60","text-yellow-400"]].map(([l,v,c]) => (
              <div key={l} className="bg-primary border border-white/10 rounded-2xl p-4 text-center card-hover">
                <p className={`text-2xl font-bold ${c}`}>{v}</p>
                <p className="text-soft text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/8 text-sm font-semibold text-white">Subject-wise Marks</div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/8 text-soft text-xs">
                <th className="text-left px-5 py-3 font-medium">Subject</th>
                <th className="text-center px-5 py-3 font-medium">Internal</th>
                <th className="text-center px-5 py-3 font-medium">External</th>
                <th className="text-center px-5 py-3 font-medium">Total</th>
                <th className="text-center px-5 py-3 font-medium">Grade</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {MY_MARKS.map(r => {
                  const total = Math.round((r.internal*0.4)+(r.external*0.6));
                  return (
                    <tr key={r.subject} className="hover:bg-white/[0.03] transition">
                      <td className="px-5 py-3 text-white font-medium">{r.subject}</td>
                      <td className="px-5 py-3 text-center text-soft">{r.internal}/40</td>
                      <td className="px-5 py-3 text-center text-soft">{r.external}/60</td>
                      <td className="px-5 py-3 text-center"><span className={`font-bold text-sm ${gradeColor(total)}`}>{total}</span></td>
                      <td className="px-5 py-3 text-center"><span className={`text-xs font-bold ${gradeColor(total)}`}>{gradeOf(total)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
