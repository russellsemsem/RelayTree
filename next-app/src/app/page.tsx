// src/app/page.tsx
"use client";

import { TreeProvider, useTree, useNode } from "@/components/treeContext";
import NodeCard from "@/components/card/nodeCard";
import DebugTree from "@/components/debugTree";

function NodeSubtree({ id }: { id: string }) {
  const { node } = useNode(id);

  return (
    <div className="mb-4">
      <NodeCard nodeId={id} />
      <div className="ml-45 mt-2 flex flex-col gap-10">
        {node.children.map(childId => (
          <NodeSubtree key={childId} id={childId} />
        ))}
      </div>
    </div>
  );
}

function TreeView() {
  const { tree } = useTree();
  return <NodeSubtree id={tree.root} />;
}

export default function Home() {
  return (
    <TreeProvider>
      <div className="p-4">
        <TreeView />
        <DebugTree />
      </div>
    </TreeProvider>
  );
}
