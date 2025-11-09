// types.ts
export interface NodeProperties {
  question: string;
  response: string | null;
}

export interface Node {
  id: string;
  status: NodeStatus;
  properties: NodeProperties;
  children: string[];
  parent: string | null;
}

export type NodeStatus = "asking" | "loading" | "answered" | "error";