"use client";
import { Node, NodeStatus } from "../types";
import { useState } from 'react';
import NodeFrame from "./nodeFrame";
import { ArrowRight, MessageCircleQuestion, MessageSquareText, RefreshCw } from "lucide-react";



interface NodeCardProps {
    node: Node;
}

export default function NodeCard({node}: NodeCardProps) {
    const [nodeStatus, setNodeStatus] = useState<NodeStatus>(node.status);
    const [question, setQuestion] = useState<string>(node.properties.question);
    const [showAnswer, setShowAnswer] = useState<boolean>(true);

    const isDisabled = question.trim().length === 0;

    const handleGetResponse = () => {
        setNodeStatus("loading");

        //Data fetch here

        // Simulate an async operation to get the response
        setTimeout(() => {
            setNodeStatus("answered");
        }, 2000);
    };
    
    const handleReset = () => {
        setNodeStatus("asking");
    };
    

    return (
    <>
        {nodeStatus === "answered" && node.properties.response ? (
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
                    {/* FRONT: answer in a NodeFrame */}
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
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
                                        px-3
                                        py-1.5
                                        rounded-full
                                        text-sm
                                        flex
                                        items-center
                                        justify-center
                                        bg-slate-300
                                        text-slate-700
                                        hover:bg-slate-600
                                        hover:text-slate-100
                                        transition
                                        cursor-pointer
                                        "
                                    >
                                        <MessageCircleQuestion className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </NodeFrame>
                    </div>

                    {/* BACK: question in a NodeFrame */}
                    <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
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
                                        px-3
                                        py-1.5
                                        rounded-full
                                        text-sm
                                        flex
                                        items-center
                                        justify-center
                                        bg-slate-300
                                        text-slate-700
                                        hover:bg-slate-600
                                        hover:text-slate-100
                                        transition
                                        cursor-pointer
                                        "
                                    >
                                        <MessageSquareText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </NodeFrame>
                    </div>
                </div>
            </div>
        ) : (
            //normal single frame for asking/loading/error
            <NodeFrame>
                {nodeStatus === "loading" && 
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-lg text-slate-500">Loading</div>
                    </div>
                }

                {nodeStatus === "asking" && (
                    <div className="flex flex-col flex-1">
                        <textarea
                            className="
                            flex-1
                            w-full
                            resize-none
                            bg-transparent
                            focus:outline-none
                            focus:ring-0
                            focus:border-transparent
                            mb-2
                            "
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask away"
                        />

                        <div className="flex justify-end">
                            <button
                                disabled={isDisabled}
                                className={`
                                px-3
                                py-1.5
                                rounded-full
                                text-sm
                                flex
                                items-center
                                justify-center
                                transition
                                ${isDisabled
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
                        <div className="text-sm text-slate-500 mb-2">Hmm.. something went wrong, try again</div>
                        <button onClick={handleReset} className=" text-sm ml-4 px-3 py-1.5 rounded-full bg-slate-300 text-slate-700 hover:bg-slate-600 hover:text-slate-100 transition cursor-pointer">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </NodeFrame>
        )}
    </>
);
}

