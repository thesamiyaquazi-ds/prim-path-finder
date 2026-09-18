import { useMemo } from "react";
import type { Edge, Graph, PrimStep } from "@/lib/prim";
import { sameEdge } from "@/lib/prim";

type Props = {
  graph: Graph;
  step?: PrimStep | null;
  start?: string;
  height?: number;
};

export function GraphCanvas({ graph, step, start, height = 380 }: Props) {
  const W = 600;
  const H = height;

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    const n = graph.vertices.length;
    const r = Math.min(W, H) / 2 - 56;
    graph.vertices.forEach((v, i) => {
      if (n === 1) {
        map[v] = { x: W / 2, y: H / 2 };
        return;
      }
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      map[v] = { x: W / 2 + r * Math.cos(angle) * 1.25, y: H / 2 + r * Math.sin(angle) };
    });
    return map;
  }, [graph.vertices, H]);

  const edgeState = (e: Edge): "mst" | "candidate" | "rejected" | "idle" => {
    if (!step) return "idle";
    if (step.mst.some((m) => sameEdge(m, e))) return "mst";
    if (step.selected && sameEdge(step.selected, e)) return "mst";
    if (step.rejected.some((c) => sameEdge(c, e))) return "rejected";
    if (step.candidates.some((c) => sameEdge(c, e))) return "candidate";
    return "idle";
  };

  const strokeFor: Record<string, string> = {
    mst: "var(--color-mst)",
    candidate: "var(--color-candidate)",
    rejected: "var(--color-destructive)",
    idle: "var(--color-edge)",
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label="Weighted graph visualization"
    >
      {graph.edges.map((e, i) => {
        const a = positions[e.from];
        const b = positions[e.to];
        if (!a || !b) return null;
        const state = edgeState(e);
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        return (
          <g key={`${e.from}-${e.to}-${i}`} className="transition-all duration-500">
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={strokeFor[state]}
              strokeWidth={state === "mst" ? 5 : state === "candidate" ? 3.5 : 2}
              strokeDasharray={state === "candidate" ? "8 6" : undefined}
              strokeLinecap="round"
              opacity={state === "idle" ? 0.45 : 1}
              className="transition-all duration-500"
            />
            <rect
              x={mid.x - 15}
              y={mid.y - 13}
              width={30}
              height={24}
              rx={8}
              fill="var(--color-card)"
              stroke={strokeFor[state]}
              strokeWidth={1.5}
              opacity={0.96}
            />
            <text
              x={mid.x}
              y={mid.y + 4}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill="var(--color-foreground)"
            >
              {e.weight}
            </text>
          </g>
        );
      })}

      {graph.vertices.map((v) => {
        const p = positions[v];
        if (!p) return null;
        const visited = step?.visited.includes(v);
        const isNew =
          step?.selected && (step.selected.to === v || step.selected.from === v) && visited;
        return (
          <g key={v} className="transition-all duration-500">
            {isNew && (
              <circle cx={p.x} cy={p.y} r={30} fill="var(--color-mst)" opacity={0.2}>
                <animate attributeName="r" values="26;34;26" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={22}
              fill={visited ? "var(--color-mst)" : "var(--color-muted)"}
              stroke={v === start ? "var(--color-candidate)" : "var(--color-border)"}
              strokeWidth={v === start ? 3 : 2}
              className="transition-all duration-500"
            />
            <text
              x={p.x}
              y={p.y + 5}
              textAnchor="middle"
              fontSize={15}
              fontWeight={800}
              fill={visited ? "var(--color-mst-foreground)" : "var(--color-foreground)"}
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Legend() {
  const items = [
    { label: "Visited vertex", color: "var(--color-mst)" },
    { label: "Unvisited vertex", color: "var(--color-muted)" },
    { label: "Candidate edge", color: "var(--color-candidate)" },
    { label: "Selected MST edge", color: "var(--color-mst)" },
    { label: "Rejected edge", color: "var(--color-destructive)" },
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
