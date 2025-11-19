import React, { useState } from "react";
import POVRules from "./components/POVRules";
import StorySetup from "./components/StorySetup";
import Workspace from "./components/Workspace";

function App() {
  const [project, setProject] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <div className="relative min-h-screen mx-auto max-w-6xl p-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">ChapterSmith AI – Complete Story Builder</h1>
          <p className="mt-2 text-blue-300/80">Turn your outline into a full story in 3–6 grounded, cohesive chapters.</p>
        </header>

        {!project ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-white font-semibold text-lg mb-4">Story Setup</h2>
                <StorySetup onCreate={setProject} />
              </div>
            </div>
            <div className="space-y-6">
              <POVRules />
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-sm">
                <h3 className="text-white font-semibold mb-3">Dialogue Rules</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Natural, character-true dialogue. Avoid stiffness.</li>
                  <li>Show emotion through tone, pauses, and body language.</li>
                  <li>Do not name feelings directly—show them.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <Workspace project={project} onBack={() => setProject(null)} />
        )}

        <footer className="mt-10 text-center text-xs text-blue-300/60">
          POV stays consistent unless Dual is selected. Word count enforced 1400–1800 per chapter.
        </footer>
      </div>
    </div>
  );
}

export default App;
