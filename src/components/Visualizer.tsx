import { useEffect, useMemo, useRef, useState } from "react";
import { GraphCanvas, Legend } from "./GraphCanvas";
import {
  EXAMPLE_GRAPH,
  runPrim,
  sameEdge,
  vertexName,
  type Edge,
  type Graph,
} from "@/lib/prim";

const makeVertices = (n: number) => Array.from({ length: n }, (_, i) => vertexName(i));

export function Visualizer() {
  const [count, setCount] = useState(5);
  const [graph, setGraph] = useState<Graph>(EXAMPLE_GRAPH);
  const [from, setFrom] = useState("A");
  const [to, setTo] = useState("B");
  const [weight, setWeight] = useState("1");
  const [start, setStart] = useState("A");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [auto, setAuto] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = useMemo(
    () => (running ? runPrim(graph, start) : []),
    [running, graph, start],
  );
  const current = running ? (steps[Math.min(stepIndex, steps.length - 1)] ?? null) : null;
  const finished = !!current?.done;

  useEffect(() => {
    if (!auto || !running) return;
    timer.current = setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setAuto(false);
          return i;
        }
        return i + 1;
      });
    }, 1400);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto, running, steps.length]);

  const resetRun = () => {
    setRunning(false);
    setAuto(false);
    setStepIndex(0);
  };

  const generate = () => {
    if (!Number.isInteger(count) || count < 2 || count > 12) {
      setError("Number of vertices must be a whole number between 2 and 12.");
      return;
    }
    const vertices = makeVertices(count);
    setGraph({ vertices, edges: [] });
    setFrom(vertices[0]!);
    setTo(vertices[1]!);
    setStart(vertices[0]!);
    setError(null);
    resetRun();
  };

  const addEdge = () => {
    const w = Number(weight);
    if (!graph.vertices.includes(from) || !graph.vertices.includes(to)) {
      setError("Invalid vertex name. Pick vertices that exist in the current graph.");
      return;
    }
    if (from === to) {
      setError("Self-loops are not allowed — an edge must connect two different vertices.");
      return;
    }
    if (weight.trim() === "" || Number.isNaN(w)) {
      setError("Please enter a numeric weight for the edge.");
      return;
    }
    if (w <= 0) {
      setError("Edge weight must be a positive number.");
      return;
    }
    const candidate: Edge = { from, to, weight: w };
    if (graph.edges.some((e) => sameEdge(e, candidate))) {
      setError(`Duplicate edge: ${from} — ${to} already exists.`);
      return;
    }
    setGraph((g) => ({ ...g, edges: [...g.edges, candidate] }));
    setError(null);
    resetRun();
  };

  const removeEdge = (i: number) => {
    setGraph((g) => ({ ...g, edges: g.edges.filter((_, idx) => idx !== i) }));
    resetRun();
  };

  const loadExample = () => {
    setGraph(EXAMPLE_GRAPH);
    setCount(EXAMPLE_GRAPH.vertices.length);
    setFrom("A");
    setTo("B");
    setStart("A");
    setError(null);
    resetRun();
  };

  const startRun = () => {
    if (graph.edges.length < graph.vertices.length - 1) {
      setError("Please create a connected weighted graph before running Prim's Algorithm.");
      return;
    }
    setError(null);
    setStepIndex(0);
    setRunning(true);
  };

  const nextStep = () => {
    if (!running) {
      startRun();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      {/* Graph + controls */}
      <div className="space-y-6">
        <div className="glass rounded-3xl p-5">
          <GraphCanvas graph={graph} step={current} start={start} />
          <div className="mt-4 border-t border-border pt-4">
            <Legend />
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-lg font-bold">Build your graph</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Number of vertices</span>
              <input
                type="number"
                min={2}
                max={12}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="field"
              />
            </label>
            <button type="button" className="btn-gradient" onClick={generate}>
              Generate Graph
            </button>
            <button type="button" className="btn-ghost" onClick={loadExample}>
              Load Example Graph
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">From vertex</span>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="field">
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">To vertex</span>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="field">
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Weight</span>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="field"
              />
            </label>
            <button type="button" className="btn-gradient" onClick={addEdge}>
              Add Edge
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Starting vertex</span>
              <select
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  resetRun();
                }}
                className="field"
              >
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm">
              {error}
            </p>
          )}

          <div className="mt-5">
            <p className="text-sm font-semibold text-muted-foreground">
              Edges ({graph.edges.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {graph.edges.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No edges yet — add edges or load the example graph.
                </span>
              )}
              {graph.edges.map((e, i) => (
                <button
                  key={`${e.from}${e.to}${i}`}
                  type="button"
                  onClick={() => removeEdge(i)}
                  title="Click to remove this edge"
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs transition-colors hover:border-destructive hover:text-destructive"
                >
                  {e.from} —{e.weight}— {e.to} ✕
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn-gradient" onClick={startRun}>
              ▶ Start
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={nextStep}
              disabled={running && finished}
            >
              Next Step
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                if (!running) startRun();
                setAuto(true);
              }}
              disabled={auto}
            >
              Auto Run
            </button>
            <button type="button" className="btn-ghost" onClick={() => setAuto(false)}>
              ⏸ Pause
            </button>
            <button type="button" className="btn-ghost" onClick={resetRun}>
              ↻ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Status panel */}
      <div className="space-y-6">
        <div className="glass rounded-3xl p-5">
          <h3 className="text-lg font-bold">Algorithm status</h3>
          {!current ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Press <strong>Start</strong> to execute Prim's Algorithm on the graph above. Every
              value on this panel comes from the real algorithm run.
            </p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Starting vertex" value={start} />
              <Row label="Current step" value={`Step ${current.index + 1} of ${steps.length}`} />
              <Row label="Visited vertices" value={current.visited.join(", ")} />
              <Row
                label="Edges selected"
                value={`${current.mst.length} / ${graph.vertices.length - 1}`}
              />
              <Row label="Current MST cost" value={String(current.cost)} />
              {current.selected && (
                <div className="rounded-xl border border-mst/50 bg-mst/10 px-4 py-3">
                  <p className="font-semibold">
                    Selected edge: {current.selected.from} → {current.selected.to} (weight{" "}
                    {current.selected.weight})
                  </p>
                </div>
              )}
              <p className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-muted-foreground">
                {current.reason}
              </p>
              {current.mst.length > 0 && (
                <div>
                  <p className="font-semibold">MST edges</p>
                  <ul className="mt-1 space-y-1 font-mono text-xs text-muted-foreground">
                    {current.mst.map((e, i) => (
                      <li key={i}>
                        {e.from} → {e.to} ({e.weight})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {current?.error && (
          <div className="glass rounded-3xl border-destructive/50 p-5">
            <h3 className="text-lg font-bold text-destructive">Disconnected graph</h3>
            <p className="mt-2 text-sm text-muted-foreground">{current.error}</p>
          </div>
        )}

        {finished && !current?.error && (
          <div className="glass rounded-3xl p-5">
            <h3 className="text-lg font-bold text-gradient">
              Minimum Spanning Tree Completed!
            </h3>
            <ul className="mt-3 space-y-1 font-mono text-sm">
              {current!.mst.map((e, i) => (
                <li key={i}>
                  {e.from} → {e.to} = {e.weight}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <Stat label="Vertices" value={graph.vertices.length} />
              <Stat label="MST edges" value={current!.mst.length} />
              <Stat label="Total cost" value={current!.cost} />
            </div>
            <button
              type="button"
              className="btn-gradient mt-5"
              onClick={() => {
                setStepIndex(0);
                setRunning(true);
              }}
            >
              Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value || "—"}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 px-2 py-3">
      <p className="text-xl font-bold text-gradient">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
