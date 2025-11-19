import React from "react";

export default function POVRules() {
  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-blue-100">
      <h3 className="text-white font-semibold mb-3">POV Rules</h3>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>All chapters use deep, immersive perspective.</li>
        <li>Default POV: Female (unless changed).</li>
        <li>Dual POV alternates automatically between leads.</li>
        <li>Users can manually set the POV for individual chapters if desired.</li>
      </ul>
    </div>
  );
}
