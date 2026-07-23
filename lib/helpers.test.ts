import { describe, expect, it } from "vitest";

import { countByStage } from "./domain";
import { formatUsd } from "./format";

describe("formatUsd", () => {
  it("formats whole USD amounts with grouping", () => {
    expect(formatUsd(12750)).toBe("$12,750");
  });
});

describe("countByStage", () => {
  it("counts every stage and keeps absent stages at zero", () => {
    const counts = countByStage([
      { stage: "prospecting" },
      { stage: "proposal" },
      { stage: "proposal" },
      { stage: "closed_won" },
    ]);

    expect(counts).toEqual({
      prospecting: 1,
      qualified: 0,
      proposal: 2,
      negotiation: 0,
      closed_won: 1,
      closed_lost: 0,
    });
  });
});
