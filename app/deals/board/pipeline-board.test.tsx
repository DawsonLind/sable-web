import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  DEAL_STAGES,
  type DealBoardDealRead,
  type DealBoardRead,
} from "@/lib/api";
import PipelineBoard, {
  type PipelineBoardTransport,
} from "./pipeline-board";

const deal: DealBoardDealRead = {
  id: 1,
  account_id: 7,
  name: "Enterprise rollout",
  amount: 18_500,
  stage: "prospecting",
  created_at: "2026-07-24T12:00:00Z",
  updated_at: "2026-07-24T12:00:00Z",
  account_name: "Acme Corp",
};

const board: DealBoardRead = {
  columns: DEAL_STAGES.map(({ value }) => ({
    stage: value,
    deals: value === "prospecting" ? [deal] : [],
  })),
};

it("renders every stage and moves a deal through its stage select", async () => {
  const transport: PipelineBoardTransport = {
    fetchDealBoard: vi.fn().mockResolvedValue(board),
    fetchCurrentUser: vi.fn().mockResolvedValue({
      sub: "demo",
      name: "Demo User",
      email: "demo@sable.dev",
    }),
    updateDealStage: vi.fn().mockResolvedValue({
      ...deal,
      stage: "qualified",
    }),
  };

  render(<PipelineBoard transport={transport} />);

  expect(await screen.findAllByTestId(/pipeline-column-/)).toHaveLength(6);
  for (const stage of DEAL_STAGES) {
    expect(
      screen.getByRole("heading", { name: stage.label }),
    ).toBeInTheDocument();
  }
  expect(screen.getAllByText("No deals")).toHaveLength(5);

  fireEvent.change(
    screen.getByRole("combobox", {
      name: "Move Enterprise rollout to stage",
    }),
    { target: { value: "qualified" } },
  );

  await waitFor(() => {
    expect(transport.updateDealStage).toHaveBeenCalledWith(1, "qualified");
  });
  await waitFor(() => {
    expect(
      within(screen.getByTestId("pipeline-column-qualified")).getByText(
        "Enterprise rollout",
      ),
    ).toBeInTheDocument();
  });
  expect(
    within(screen.getByTestId("pipeline-column-prospecting")).getByText(
      "No deals",
    ),
  ).toBeInTheDocument();
});
