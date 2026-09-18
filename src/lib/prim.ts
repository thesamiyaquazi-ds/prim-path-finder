export type Edge = { from: string; to: string; weight: number };

export type Graph = {
  vertices: string[];
  edges: Edge[];
};

export type PrimStep = {
  index: number;
  selected: Edge | null;
  candidates: Edge[];
  rejected: Edge[];
  visited: string[];
  mst: Edge[];
  cost: number;
  reason: string;
  done: boolean;
  error?: string;
};

export const vertexName = (i: number): string => {
  let s = "";
  let n = i;
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
};

export const sameEdge = (a: Edge, b: Edge) =>
  (a.from === b.from && a.to === b.to) || (a.from === b.to && a.to === b.from);

/**
 * Real Prim's algorithm. Returns the full list of steps so the UI can
 * step forward/backward without ever faking a result.
 */
export function runPrim(graph: Graph, start: string): PrimStep[] {
  const steps: PrimStep[] = [];
  const { vertices, edges } = graph;
  if (vertices.length === 0) return steps;

  const visited: string[] = [start];
  const mst: Edge[] = [];
  let cost = 0;

  steps.push({
    index: 0,
    selected: null,
    candidates: [],
    rejected: [],
    visited: [...visited],
    mst: [],
    cost: 0,
    reason: `Start at vertex ${start}. Mark it visited. The tree currently holds one vertex and no edges.`,
    done: vertices.length === 1,
  });

  while (visited.length < vertices.length) {
    const candidates = edges.filter((e) => {
      const fromIn = visited.includes(e.from);
      const toIn = visited.includes(e.to);
      return (fromIn && !toIn) || (toIn && !fromIn);
    });

    if (candidates.length === 0) {
      steps.push({
        index: steps.length,
        selected: null,
        candidates: [],
        rejected: [],
        visited: [...visited],
        mst: [...mst],
        cost,
        reason:
          "No edge connects the visited set to any remaining vertex. The graph is disconnected, so no spanning tree exists.",
        done: true,
        error:
          "Disconnected graph: Prim's Algorithm cannot reach all vertices. Add edges so every vertex is connected.",
      });
      return steps;
    }

    const selected = candidates.reduce((best, e) => (e.weight < best.weight ? e : best));
    const newVertex = visited.includes(selected.from) ? selected.to : selected.from;
    const known = visited.includes(selected.from) ? selected.from : selected.to;

    visited.push(newVertex);
    mst.push({ from: known, to: newVertex, weight: selected.weight });
    cost += selected.weight;

    steps.push({
      index: steps.length,
      selected: { from: known, to: newVertex, weight: selected.weight },
      candidates,
      rejected: candidates.filter((c) => !sameEdge(c, selected)),
      visited: [...visited],
      mst: [...mst],
      cost,
      reason: `${known} → ${newVertex} with weight ${selected.weight} is the minimum-weight edge connecting a visited vertex to an unvisited vertex.`,
      done: visited.length === vertices.length,
    });
  }

  return steps;
}

export const EXAMPLE_GRAPH: Graph = {
  vertices: ["A", "B", "C", "D", "E"],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "C", to: "E", weight: 10 },
    { from: "D", to: "E", weight: 2 },
  ],
};
