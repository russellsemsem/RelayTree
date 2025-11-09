// src/components/DebugTree.tsx
"use client";

import { useTree } from "./treeContext";

export default function DebugTree() {
  const { tree } = useTree();

  return (
    <div className="mt-6 p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-auto max-h-80">
      <div className="mb-1 font-semibold text-slate-300">Tree debug</div>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
}
