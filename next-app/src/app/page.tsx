import NodeCard from "@/components/card/nodeCard";

export default function Home() {
  return (
    <div>
      <NodeCard
        node={{
          id: "1",
          status: "asking",
          properties: {
            question: "",
            response: "SF"
          },
          children: [],
          parent: null
        }}
      />
    </div>
  );
}