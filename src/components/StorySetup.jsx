import React, { useState } from "react";

export default function StorySetup({ onCreate }) {
  const [name, setName] = useState("My Project");
  const [outline, setOutline] = useState("");
  const [chapterCount, setChapterCount] = useState(3);
  const [povMode, setPovMode] = useState("female");
  const [genre, setGenre] = useState("general");
  const [rules, setRules] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL || "";

  const createProject = async () => {
    if (!outline.trim()) {
      alert("Please paste your outline.");
      return;
    }
    const body = { name, outline, chapter_count: chapterCount, pov_mode: povMode, genre, rules };
    const res = await fetch(`${backend}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.id) onCreate({ id: data.id, ...body });
    else alert("Failed to create project");
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-blue-200 mb-1">Project Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white" />
      </div>

      <div>
        <label className="block text-sm text-blue-200 mb-1">Outline</label>
        <textarea value={outline} onChange={(e) => setOutline(e.target.value)} rows={8} placeholder="Paste your scene-by-scene or bullet outline here" className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Chapters</label>
          <select value={chapterCount} onChange={(e) => setChapterCount(Number(e.target.value))} className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white">
            {[3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">POV Settings (Optional)</label>
          <select value={povMode} onChange={(e) => setPovMode(e.target.value)} className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white">
            <option value="female">Female Lead POV (default)</option>
            <option value="male">Male Lead POV</option>
            <option value="dual">Dual POV (alternate)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Genre (Optional)</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white">
            <option value="general">General</option>
            <option value="billionaire">Billionaire Romance</option>
            <option value="werewolf">Werewolf Romance</option>
            <option value="mafia">Mafia Romance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-blue-200 mb-1">Writing Rules (Optional)</label>
        <textarea value={rules} onChange={(e) => setRules(e.target.value)} rows={6} placeholder="Paste additional style rules to enforce" className="w-full rounded-md bg-slate-900/70 border border-blue-500/30 px-3 py-2 text-white" />
      </div>

      <div className="flex justify-end">
        <button onClick={createProject} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium">Create Project</button>
      </div>
    </div>
  );
}
