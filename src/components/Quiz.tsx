import { useState } from "react";

const QUESTIONS = [
  {
    q: "Prim's Algorithm is used to find:",
    options: ["Shortest Path", "Minimum Spanning Tree", "Maximum Flow", "Sorting Order"],
    answer: 1,
  },
  {
    q: "Prim's Algorithm follows which technique?",
    options: ["Divide and Conquer", "Dynamic Programming", "Greedy", "Backtracking"],
    answer: 2,
  },
  {
    q: "An MST of a graph with V vertices contains exactly:",
    options: ["V edges", "V − 1 edges", "E − V edges", "2V edges"],
    answer: 1,
  },
  {
    q: "Time complexity of Prim's Algorithm using an adjacency matrix is:",
    options: ["O(E log V)", "O(V log E)", "O(V²)", "O(V + E)"],
    answer: 2,
  },
  {
    q: "Which property guarantees Prim's greedy choice is safe?",
    options: ["Cut property", "Cycle rule", "Optimal substring", "Pigeonhole principle"],
    answer: 0,
  },
  {
    q: "Compared with Kruskal's Algorithm, Prim's Algorithm:",
    options: [
      "Builds a forest of components",
      "Grows a single tree from a start vertex",
      "Always needs sorted edges",
      "Cannot produce an MST",
    ],
    answer: 1,
  },
];

export function Quiz() {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = QUESTIONS.reduce((s, q, i) => (picked[i] === q.answer ? s + 1 : s), 0);

  return (
    <div className="space-y-5">
      {QUESTIONS.map((q, i) => (
        <div key={i} className="glass rounded-2xl p-5">
          <p className="font-semibold">
            Q{i + 1}. {q.q}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {q.options.map((o, oi) => {
              const isPicked = picked[i] === oi;
              const state = submitted
                ? oi === q.answer
                  ? "correct"
                  : isPicked
                    ? "wrong"
                    : "idle"
                : isPicked
                  ? "picked"
                  : "idle";
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setPicked((p) => ({ ...p, [i]: oi }))}
                  className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                    state === "correct"
                      ? "border-mst bg-mst/15 text-foreground"
                      : state === "wrong"
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : state === "picked"
                          ? "border-primary bg-primary/15"
                          : "border-border hover:border-primary/60 hover:bg-primary/5"
                  }`}
                >
                  {String.fromCharCode(65 + oi)}. {o}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-3 text-xs text-muted-foreground">
              {picked[i] === q.answer
                ? "Correct."
                : `Incorrect — the right answer is ${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}.`}
            </p>
          )}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(picked).length < QUESTIONS.length}
            className="btn-gradient disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit answers
          </button>
        ) : (
          <>
            <span className="rounded-xl border border-mst/50 bg-mst/15 px-5 py-2.5 font-semibold">
              Your Score: {score}/{QUESTIONS.length}
            </span>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setPicked({});
                setSubmitted(false);
              }}
            >
              Try again
            </button>
          </>
        )}
        {!submitted && (
          <span className="text-xs text-muted-foreground">
            Answer all {QUESTIONS.length} questions to submit.
          </span>
        )}
      </div>
    </div>
  );
}
