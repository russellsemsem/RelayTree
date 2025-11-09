// src/components/treeContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Node } from "./types";
import initialData from "@/data/initialTree.json";

interface Tree {
  root: string;
  nodes: Record<string, Node>;
}

interface TreeContextValue {
  tree: Tree;
  updateNode: (id: string, updater: (node: Node) => Node) => void;
  addChild: (parentId: string, child: Node) => void;
  removeChild: (parentId: string, childId: string) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ children }: { children: ReactNode }) {
  const [tree, setTree] = useState<Tree>(initialData as Tree);

  const updateNode = (id: string, updater: (node: Node) => Node) => {
    setTree(prev => {
      const node = prev.nodes[id];
      if (!node) return prev;
      const updated = updater(node);

      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: updated,
        },
      };
    });
  };

  const addChild = (parentId: string, child: Node) => {
    setTree(prev => {
      const parent = prev.nodes[parentId];
      if (!parent) return prev;

      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [parentId]: {
            ...parent,
            children: [...parent.children, child.id],
          },
          [child.id]: child,
        },
      };
    });
  };

  const removeChild = (parentId: string, childId: string) => {
    setTree(prev => {
      const parent = prev.nodes[parentId];
      if (!parent) return prev;

      const { [childId]: _, ...restNodes } = prev.nodes;

      return {
        ...prev,
        nodes: {
          ...restNodes,
          [parentId]: {
            ...parent,
            children: parent.children.filter(id => id !== childId),
          },
        },
      };
    });
  };

  return (
    <TreeContext.Provider value={{ tree, updateNode, addChild, removeChild }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTree must be used inside TreeProvider");
  return ctx;
}

export function useNode(id: string) {
  const { tree, updateNode, addChild, removeChild } = useTree();
  const node = tree.nodes[id];
  if (!node) throw new Error(`Node ${id} not found`);
  return { node, updateNode, addChild, removeChild };
}
