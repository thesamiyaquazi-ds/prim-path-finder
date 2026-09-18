import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Visualizer } from "@/components/Visualizer";
import { GraphCanvas } from "@/components/GraphCanvas";
import { Quiz } from "@/components/Quiz";
import { EXAMPLE_GRAPH, runPrim } from "@/lib/prim";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prim's Algorithm Visualizer — DAA Minimum Spanning Tree" },
      {
        name: "description",
        content:
          "Interactive Prim's Algorithm visualizer for Design and Analysis of Algorithms: build a weighted graph and watch the Minimum Spanning Tree form step by step.",
      },
      { property: "og:title", content: "Prim's Algorithm Visualizer — DAA" },
      {
        property: "og:description",
        content:
          "Build a weighted graph and run Prim's Algorithm step by step to construct a Minimum Spanning Tree.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["home", "Home"],
  ["theory", "Theory"],
  ["algorithm", "Algorithm"],
  ["visualizer", "Visualizer"],
  ["example", "Example"],
  ["complexity", "Complexity"],
  ["applications", "Applications"],
] as const;

function Index() {
  const [light, setLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#home" className="font-display text-base font-bold">
            <span className="text-gradient">Prim&apos;s</span> Visualizer
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLight((l) => !l)}
              className="rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary"
              aria-label="Toggle colour theme"
            >
              {light ? "🌙" : "☀️"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-3 py-2 text-sm md:hidden"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="grid gap-1 border-t border-border px-5 py-3 md:hidden">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl space-y-24 px-5 py-16">
        {/* HERO */}
        <section id="home" className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="inline-flex rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Design and Analysis of Algorithms (DAA)
            </p>
            <h1 className="mt-5 text-5xl leading-tight font-extrabold sm:text-6xl">
              <span className="text-gradient">Prim&apos;s Algorithm</span> Visualizer
            </h1>
            <p className="mt-3 text-lg font-medium text-muted-foreground">
              Finding the Minimum Spanning Tree step by step.
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Explore how Prim&apos;s Algorithm constructs a Minimum Spanning Tree by repeatedly
              selecting the minimum-weight edge that connects a visited vertex to an unvisited
              vertex.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#visualizer" className="btn-gradient">
                Try Visualizer
              </a>
              <a href="#algorithm" className="btn-ghost">
                Learn Algorithm
              </a>
            </div>
          </div>
          <div className="glass rounded-3xl p-4">
            <GraphCanvas graph={EXAMPLE_GRAPH} height={320} start="A" />
            <p className="pb-2 text-center text-xs text-muted-foreground">
              A connected, weighted, undirected graph
            </p>
          </div>
        </section>

        {/* THEORY */}
        <Section
          id="theory"
          title="Theory"
          lead="The core idea behind Prim's Algorithm, in student-friendly language."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="What is Prim's Algorithm?">
              <p>
                Prim&apos;s Algorithm is a greedy algorithm used to find the Minimum Spanning Tree
                (MST) of a connected, weighted, undirected graph.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Connects all vertices</li>
                <li>Contains no cycles</li>
                <li>Has the minimum possible total edge weight</li>
                <li>Has exactly V − 1 edges for V vertices</li>
              </ul>
            </Card>
            <Card title="Why is it greedy?">
              <p>
                At every step the algorithm looks only at the edges leaving the tree it has built so
                far and picks the cheapest one. It makes the locally best choice each time, without
                looking ahead — and thanks to the cut property of MSTs, that local choice is always
                globally safe.
              </p>
            </Card>
          </div>

          <h3 className="mt-10 mb-4 text-xl font-bold">Important terms</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Graph", "A set of vertices connected by edges, written G = (V, E)."],
              ["Vertex", "A single node of the graph, such as A or B."],
              ["Edge", "A link joining two vertices."],
              ["Weight", "The cost, distance or capacity attached to an edge."],
              ["Spanning Tree", "A cycle-free subgraph that connects every vertex using V − 1 edges."],
              ["Minimum Spanning Tree", "The spanning tree whose total edge weight is smallest."],
              ["Greedy Algorithm", "A method that takes the best immediate option at each step."],
            ].map(([t, d]) => (
              <div key={t} className="glass rounded-2xl p-5">
                <p className="font-display font-bold">{t}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ALGORITHM */}
        <Section id="algorithm" title="Algorithm" lead="The procedure and its pseudocode.">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-3xl p-6">
              <ol className="space-y-3">
                {[
                  "Select a starting vertex.",
                  "Mark it as visited.",
                  "Find all edges connecting visited vertices to unvisited vertices.",
                  "Select the edge with the minimum weight.",
                  "Add the selected edge to the MST.",
                  "Mark the newly connected vertex as visited.",
                  "Repeat until all vertices are included.",
                  "Display the final MST and total cost.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-1">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="glass overflow-x-auto rounded-3xl p-6">
              <p className="mb-3 text-sm font-semibold text-muted-foreground">Pseudocode</p>
              <pre className="font-mono text-xs leading-relaxed whitespace-pre">{`Prim(G):
    Choose a starting vertex
    Mark starting vertex as visited
    MST = empty

    while all vertices are not visited:
        Find minimum-weight edge
        connecting a visited vertex to
        an unvisited vertex

        Add edge to MST
        Mark new vertex as visited

    return MST`}</pre>
            </div>
          </div>
        </Section>

        {/* VISUALIZER */}
        <Section
          id="visualizer"
          title="Interactive Visualizer"
          lead="Build your own graph or load the example, then run the real algorithm one step at a time."
        >
          <Visualizer />
        </Section>

        {/* EXAMPLE */}
        <Section
          id="example"
          title="Example Walkthrough"
          lead="Prim's Algorithm on the sample graph, starting at vertex A."
        >
          <ExampleWalkthrough />
        </Section>

        {/* COMPLEXITY */}
        <Section id="complexity" title="Complexity" lead="How the cost grows with the graph size.">
          <div className="grid gap-5 md:grid-cols-3">
            <Card title="Time — adjacency matrix">
              <p className="text-gradient font-display text-3xl font-extrabold">O(V²)</p>
              <p className="mt-2 text-sm">
                Each iteration scans every vertex to find the cheapest crossing edge.
              </p>
            </Card>
            <Card title="Time — adjacency list + binary heap">
              <p className="text-gradient font-display text-3xl font-extrabold">O(E log V)</p>
              <p className="mt-2 text-sm">
                A priority queue supplies the minimum edge in logarithmic time.
              </p>
            </Card>
            <Card title="Space">
              <p className="text-gradient font-display text-3xl font-extrabold">O(V + E)</p>
              <p className="mt-2 text-sm">
                Storage for the graph, the visited set and the growing tree.
              </p>
            </Card>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            V = number of vertices &nbsp;·&nbsp; E = number of edges
          </p>
        </Section>

        {/* APPLICATIONS */}
        <Section id="applications" title="Applications" lead="Where Minimum Spanning Trees are used.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["🖧", "Computer networks", "Lay cable between sites at minimum total length."],
              ["☎️", "Telephone networks", "Connect exchanges with the least wiring cost."],
              ["🛣️", "Road network design", "Link towns with the cheapest set of roads."],
              ["⚡", "Electrical power distribution", "Plan low-cost transmission grids."],
              ["🚰", "Water pipeline networks", "Reach every area with minimal piping."],
              ["📺", "Cable TV networks", "Serve all households economically."],
              ["🏗️", "Network infrastructure", "Design backbones and cluster layouts."],
              ["🧭", "Approximation algorithms", "Used as a base step in tour and clustering problems."],
            ].map(([icon, t, d]) => (
              <div key={t} className="glass rounded-2xl p-5">
                <span className="text-2xl">{icon}</span>
                <p className="mt-2 font-display font-bold">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* COMPARISON */}
        <Section
          id="comparison"
          title="Prim vs Kruskal"
          lead="Two greedy routes to the same goal — each fits different graphs."
        >
          <div className="glass overflow-x-auto rounded-3xl p-2">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold">Prim&apos;s Algorithm</th>
                  <th className="p-4 font-semibold">Kruskal&apos;s Algorithm</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Type", "Greedy", "Greedy"],
                  ["Approach", "Grows one tree", "Builds a forest"],
                  ["Starting vertex", "Required", "Not required"],
                  ["Main structure", "Priority queue / matrix", "Disjoint set"],
                  ["Best suited for", "Dense graphs", "Sparse graphs"],
                  ["Produces an MST", "Yes", "Yes"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-t border-border/60">
                    <td className="p-4 font-semibold">{a}</td>
                    <td className="p-4 text-muted-foreground">{b}</td>
                    <td className="p-4 text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* QUIZ */}
        <Section id="quiz" title="Quiz" lead="Check your understanding — six questions.">
          <Quiz />
        </Section>

        {/* PROS / CONS */}
        <Section id="analysis" title="Advantages, Limitations & DAA Analysis">
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Advantages">
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                <li>Simple greedy approach that is easy to reason about</li>
                <li>Directly solves MST problems</li>
                <li>Effective and fast on dense graphs</li>
                <li>Easy to visualize as a growing tree</li>
              </ul>
            </Card>
            <Card title="Limitations">
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                <li>Requires a connected graph to produce a single MST</li>
                <li>Standard Prim&apos;s is designed for undirected weighted graphs</li>
                <li>Performance depends on the graph representation and data structure</li>
              </ul>
            </Card>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Card title="Input & Output">
              <p className="text-sm">
                <strong>Input:</strong> a connected weighted undirected graph.
              </p>
              <p className="mt-2 text-sm">
                <strong>Output:</strong> a Minimum Spanning Tree and its total weight.
              </p>
              <p className="mt-2 text-sm">
                <strong>Strategy:</strong> greedy approach.
              </p>
            </Card>
            <Card title="Correctness idea">
              <p className="text-sm">
                At every step, Prim&apos;s Algorithm selects a minimum-weight edge crossing the cut
                between the vertices already in the tree and those outside it. By the cut property
                of MSTs, this edge can safely belong to an MST.
              </p>
            </Card>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold text-gradient">
              Prim&apos;s Algorithm Visualizer
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              An interactive DAA learning tool for understanding Minimum Spanning Trees.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Designed for DAA Students</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href="#theory" className="hover:text-foreground">
              Theory
            </a>
            <a href="#visualizer" className="hover:text-foreground">
              Visualizer
            </a>
            <a href="#complexity" className="hover:text-foreground">
              Complexity
            </a>
            <a href="#quiz" className="hover:text-foreground">
              Quiz
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {lead && <p className="mt-2 max-w-2xl text-muted-foreground">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </div>
  );
}

function ExampleWalkthrough() {
  const steps = runPrim(EXAMPLE_GRAPH, "A");
  const final = steps[steps.length - 1]!;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="glass rounded-3xl p-5">
        <GraphCanvas graph={EXAMPLE_GRAPH} step={final} start="A" height={340} />
        <p className="pb-1 text-center text-sm text-muted-foreground">
          Final MST highlighted · total weight {final.cost}
        </p>
      </div>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.index} className="glass rounded-2xl p-4">
            <p className="text-sm font-bold">
              Step {s.index + 1}
              {s.selected && (
                <span className="ml-2 font-mono text-xs font-semibold text-mst">
                  {s.selected.from} → {s.selected.to} = {s.selected.weight}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.reason}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Visited: {s.visited.join(", ")} · Cost: {s.cost}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
