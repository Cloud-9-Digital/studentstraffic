import { AlertTriangle, Info } from "lucide-react";

import type { DeepDiveBlock, DeepDiveSection } from "./types";

function Block({ block }: { block: DeepDiveBlock }) {
  switch (block.kind) {
    case "paragraph":
      return <p className="text-sm leading-7 text-gray-600">{block.text}</p>;

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
              {block.ordered ? (
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: "#0f3d37" }}
                >
                  {i + 1}
                </span>
              ) : (
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gray-300" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr style={{ background: "#0f3d37" }}>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-white/70"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: "rgba(0,0,0,0.06)", background: i % 2 === 0 ? "white" : "#FAFAFA" }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        j === 0
                          ? "px-4 py-3 font-semibold text-gray-800"
                          : "px-4 py-3 leading-6 text-gray-600"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout": {
      const isWarning = block.tone === "warning";
      return (
        <div
          className="flex items-start gap-3 rounded-2xl border p-4"
          style={{
            borderColor: isWarning ? "rgba(194,65,12,0.2)" : "rgba(15,61,55,0.15)",
            background: isWarning ? "#FFF7ED" : "#F0FDF9",
          }}
        >
          {isWarning ? (
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-600" />
          ) : (
            <Info className="mt-0.5 size-4 shrink-0" style={{ color: "#0f3d37" }} />
          )}
          <p className="text-xs leading-6 text-gray-700">{block.text}</p>
        </div>
      );
    }
  }
}

type Props = {
  sections?: DeepDiveSection[];
};

export function LpDeepDive({ sections }: Props) {
  if (!sections?.length) return null;

  return (
    <section className="border-t border-gray-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl space-y-16 px-4">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#F5A623" }}>
              {section.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: "#0f3d37" }}>
              {section.heading}
            </h2>
            {section.intro && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">{section.intro}</p>
            )}
            <div className="mt-6 space-y-5">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
