import React, { useEffect, useState } from "react";

export default function Workspace({ project, onBack }) {
  const backend = import.meta.env.VITE_BACKEND_URL || "";
  const [chapters, setChapters] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const refresh = async () => {
    const res = await fetch(`${backend}/api/projects/${project.id}`);
    const data = await res.json();
    setChapters(data.chapters || []);
  };

  useEffect(() => { refresh(); }, []);

  const generateAll = async () => {
    setLoadingAll(true);
    await fetch(`${backend}/api/projects/${project.id}/chapters/generate_all`, { method: "POST" });
    await refresh();
    setLoadingAll(false);
  };

  const generateOne = async (n) => {
    setGenLoading(true);
    await fetch(`${backend}/api/projects/${project.id}/chapters/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter_number: n })
    });
    await refresh();
    setGenLoading(false);
  };

  const openEditor = (ch) => {
    setSelectedChapter(ch);
    setEditTitle(ch.title || "");
    setEditText(ch.text || "");
  };

  const saveEdits = async () => {
    if (!selectedChapter) return;
    await fetch(`${backend}/api/projects/${project.id}/chapters/${selectedChapter.number}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, text: editText })
    });
    setSelectedChapter(null);
    await refresh();
  };

  const copyChapter = async (ch) => {
    const res = await fetch(`${backend}/api/projects/${project.id}/chapters/${ch.number}/copy`);
    const data = await res.json();
    await navigator.clipboard.writeText(data.text || "");
    alert("Chapter copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-semibold">{project.name}</h2>
          <p className="text-blue-200/80 text-sm">Chapters: {project.chapter_count} • POV: {project.pov_mode}</p>
        </div>
        <div className="space-x-2">
          <button onClick={onBack} className="px-3 py-2 rounded-md bg-slate-700 text-blue-100">Back</button>
          <button onClick={generateAll} disabled={loadingAll} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60">{loadingAll ? "Generating..." : "Generate All"}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: project.chapter_count }).map((_, i) => {
            const ch = chapters.find(c => c.number === i+1);
            return (
              <div key={i} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">Chapter {i+1}{ch?.title ? `: ${ch.title}` : ""}</h3>
                  <div className="space-x-2">
                    <button onClick={() => generateOne(i+1)} disabled={genLoading} className="px-3 py-1.5 rounded-md bg-blue-600 text-white disabled:opacity-60">Generate</button>
                    {ch && <button onClick={() => openEditor(ch)} className="px-3 py-1.5 rounded-md bg-slate-700 text-blue-100">Edit</button>}
                    {ch && <button onClick={() => copyChapter(ch)} className="px-3 py-1.5 rounded-md bg-slate-700 text-blue-100">Copy</button>}
                  </div>
                </div>
                <p className="text-blue-200/80 text-sm mb-2">POV: {ch?.pov || (project.pov_mode === 'dual' ? ( ( (i+1)%2===1) ? 'female' : 'male') : project.pov_mode)}</p>
                <div className="prose prose-invert max-w-none text-blue-100 whitespace-pre-wrap text-sm leading-6">
                  {ch ? ch.text : <em className="text-blue-300/70">No content yet.</em>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-blue-100">
            <h3 className="text-white font-semibold mb-3">POV Logic</h3>
            <pre className="text-xs bg-slate-900/60 rounded p-3 overflow-auto">
{`if (povMode === "female") {
  chapterPOV = "female";
} else if (povMode === "male") {
  chapterPOV = "male";
} else if (povMode === "dual") {
  if (chapterNumber % 2 === 1) chapterPOV = "female";
  else chapterPOV = "male";
}`}
            </pre>
            <p className="text-xs mt-2">Dual POV alternates automatically between leads.</p>
          </div>
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-blue-100">
            <h3 className="text-white font-semibold mb-3">Writing Rules (Summary)</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>First-person, immersive, grounded.</li>
              <li>1400–1800 words per chapter.</li>
              <li>No metaphors or poetic language.</li>
              <li>Smooth pacing and clear dialogue.</li>
              <li>End each chapter with a hook or emotional beat.</li>
            </ul>
          </div>
        </div>
      </div>

      {selectedChapter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-xl border border-blue-500/30 p-6">
            <h3 className="text-white font-semibold mb-4">Edit Chapter {selectedChapter.number}</h3>
            <div className="space-y-3">
              <input value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} placeholder="Title" className="w-full rounded-md bg-slate-800 border border-blue-500/30 px-3 py-2 text-white" />
              <textarea value={editText} onChange={(e)=>setEditText(e.target.value)} rows={16} className="w-full rounded-md bg-slate-800 border border-blue-500/30 px-3 py-2 text-white" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={()=>setSelectedChapter(null)} className="px-3 py-2 rounded-md bg-slate-700 text-blue-100">Cancel</button>
              <button onClick={saveEdits} className="px-3 py-2 rounded-md bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
