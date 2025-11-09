// src/components/card/nodeCard.tsx
"use client";
import { useState } from "react";
import { NodeStatus, Node } from "../types";
import NodeFrame from "./nodeFrame";
import {
  ArrowRight,
  MessageCircleQuestion,
  MessageSquareText,
  RefreshCw,
  CirclePlus,
} from "lucide-react";
import { useNode } from "../treeContext";

interface NodeCardProps {
  nodeId: string;
}

export default function NodeCard({ nodeId }: NodeCardProps) {
  const { node, updateNode, addChild } = useNode(nodeId);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);

  const isDisabled = node.properties.question.trim().length === 0;

  const setNodeStatus = (status: NodeStatus) => {
    updateNode(nodeId, n => ({ ...n, status }));
  };

  const setQuestion = (question: string) => {
    updateNode(nodeId, n => ({
      ...n,
      properties: { ...n.properties, question },
    }));
  };

    const handleGetResponse = async () => {
    const question = node.properties.question.trim();
    if (!question) return;

    setNodeStatus("loading");

    try {
        const res = await fetch("http://localhost:3030/response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
        });

        if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
        }

        // backend is sending plain text
        const answer = await res.text();

        updateNode(nodeId, n => ({
        ...n,
        status: "answered",
        properties: {
            ...n.properties,
            response: answer,
        },
        }));
    } catch (error) {
        console.error("Error fetching response:", error);
        updateNode(nodeId, n => ({
        ...n,
        status: "error",
        }));
    }
    };


  const handleReset = () => {
    updateNode(nodeId, n => ({
      ...n,
      status: "asking",
      properties: { ...n.properties, response: null },
    }));
  };

  const handleAddChild = () => {
    const childId = crypto.randomUUID();

    const child: Node = {
      id: childId,
      status: "asking",
      properties: {
        question: "",
        response: null,
      },
      children: [],
      parent: nodeId,
    };

    addChild(nodeId, child);
  };

  const nodeStatus = node.status;

  return (
    <>
      {nodeStatus === "answered" && node.properties.response ? (
        // flip card version
        <div
          className="relative w-full max-w-xs h-80"
          style={{ perspective: "1000px" }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: showAnswer ? "rotateY(0deg)" : "rotateY(180deg)",
            }}
          >
            {/* FRONT: answer */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <NodeFrame>
                <div className="flex flex-col flex-1">
                  <p className="flex-1 whitespace-pre-wrap text-sm text-slate-900">
                    {node.properties.response}
                  </p>

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAnswer(false)}
                      className="
                        px-3 py-1.5 rounded-full text-sm flex items-center justify-center
                        bg-slate-300 text-slate-700 hover:bg-slate-600 hover:text-slate-100 transition
                      "
                    >
                      <MessageCircleQuestion className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </NodeFrame>
            </div>

            {/* BACK: question */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <NodeFrame>
                <div className="flex flex-col flex-1">
                  <p className="flex-1 whitespace-pre-wrap text-sm text-slate-900">
                    {node.properties.question}
                  </p>

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAnswer(true)}
                      className="
                        px-3 py-1.5 rounded-full text-sm flex items-center justify-center
                        bg-slate-300 text-slate-700 hover:bg-slate-600 hover:text-slate-100 transition
                      "
                    >
                      <MessageSquareText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </NodeFrame>
            </div>
          </div>

          {/* ADD CHILD BUTTON */}
          <button
            type="button"
            onClick={handleAddChild}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              bottom-[-32px]
              flex items-center justify-center
              text-slate-400
              hover:text-slate-700
              transition
            "
          >
            <CirclePlus className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // ASKING / LOADING / ERROR
        <NodeFrame>
          {nodeStatus === "loading" && (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-lg text-slate-500">Loading</div>
            </div>
          )}

          {nodeStatus === "asking" && (
            <div className="flex flex-col flex-1">
              <textarea
                className="
                  flex-1 w-full resize-none bg-transparent
                  focus:outline-none focus:ring-0 focus:border-transparent mb-2
                "
                value={node.properties.question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask away"
              />

              <div className="flex justify-end">
                <button
                  disabled={isDisabled}
                  className={`
                    px-3 py-1.5 rounded-full text-sm flex items-center justify-center transition
                    ${
                      isDisabled
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                        : "bg-slate-300 text-slate-500 hover:bg-slate-600 hover:text-slate-100 cursor-pointer"
                    }
                  `}
                  onClick={handleGetResponse}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {nodeStatus === "error" && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="text-sm text-slate-500 mb-2">
                Hmm.. something went wrong, try again
              </div>
              <button
                onClick={handleReset}
                className="
                  text-sm ml-4 px-3 py-1.5 rounded-full bg-slate-300
                  text-slate-700 hover:bg-slate-600 hover:text-slate-100 transition cursor-pointer
                "
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </NodeFrame>
      )}
    </>
  );
}
