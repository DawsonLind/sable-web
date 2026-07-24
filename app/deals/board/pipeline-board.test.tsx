import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import {
  DEAL_STAGES,
  type DealBoardDealRead,
  type DealBoardRead,
} from "@/lib/api";
import PipelineBoard, {
  type PipelineBoardTransport,
} from "./pipeline-board";

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "elementFromPoint");
});

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

it("moves a deal from the pointer location when Chrome ends without a drop event", async () => {
  const transport: PipelineBoardTransport = {
    fetchDealBoard: vi.fn().mockResolvedValue(board),
    fetchCurrentUser: vi.fn().mockResolvedValue({
      sub: "demo",
      name: "Demo User",
      email: "demo@sable.dev",
    }),
    updateDealStage: vi.fn().mockResolvedValue({
      ...deal,
      stage: "proposal",
    }),
  };
  const transferData = new Map<string, string>();
  const dataTransfer = {
    effectAllowed: "none",
    dropEffect: "none",
    setData: vi.fn((format: string, value: string) => {
      transferData.set(format, value);
    }),
    getData: vi.fn((format: string) => transferData.get(format) ?? ""),
  };

  render(<PipelineBoard transport={transport} />);

  const card = await screen.findByRole("article");
  const targetColumn = screen.getByTestId("pipeline-column-proposal");
  Object.defineProperty(document, "elementFromPoint", {
    configurable: true,
    value: vi.fn().mockReturnValue(targetColumn),
  });
  fireEvent.dragStart(card, { dataTransfer });
  fireEvent.dragOver(targetColumn, {
    dataTransfer,
  });
  expect(targetColumn).toHaveClass("pipeline-column--drop-target");
  const dragLeaveEvent = new Event("dragleave", { bubbles: true });
  Object.defineProperty(dragLeaveEvent, "relatedTarget", {
    value: targetColumn.querySelector(".pipeline-column__deals"),
  });
  fireEvent(targetColumn, dragLeaveEvent);
  expect(targetColumn).toHaveClass("pipeline-column--drop-target");
  dataTransfer.dropEffect = "none";
  fireEvent.dragEnd(screen.getByRole("article"), {
    dataTransfer,
    clientX: 100,
    clientY: 100,
  });

  await waitFor(() => {
    expect(transport.updateDealStage).toHaveBeenCalledOnce();
    expect(transport.updateDealStage).toHaveBeenCalledWith(1, "proposal");
  });
  await waitFor(() => {
    expect(
      within(screen.getByTestId("pipeline-column-proposal")).getByText(
        "Enterprise rollout",
      ),
    ).toBeInTheDocument();
  });
  expect(
    within(screen.getByTestId("pipeline-column-prospecting")).getByLabelText(
      "0 deals",
    ),
  ).toBeInTheDocument();
  expect(
    within(screen.getByTestId("pipeline-column-proposal")).getByLabelText(
      "1 deals",
    ),
  ).toBeInTheDocument();
});

it("does not update a deal twice when drop and dragend both fire", async () => {
  const transport: PipelineBoardTransport = {
    fetchDealBoard: vi.fn().mockResolvedValue(board),
    fetchCurrentUser: vi.fn().mockResolvedValue({
      sub: "demo",
      name: "Demo User",
      email: "demo@sable.dev",
    }),
    updateDealStage: vi.fn().mockResolvedValue({
      ...deal,
      stage: "proposal",
    }),
  };
  const dataTransfer = {
    effectAllowed: "none",
    dropEffect: "none",
    setData: vi.fn(),
    getData: vi.fn(),
  };

  render(<PipelineBoard transport={transport} />);

  const card = await screen.findByRole("article");
  const targetColumn = screen.getByTestId("pipeline-column-proposal");
  Object.defineProperty(document, "elementFromPoint", {
    configurable: true,
    value: vi.fn().mockReturnValue(targetColumn),
  });

  fireEvent.dragStart(card, { dataTransfer });
  fireEvent.dragOver(targetColumn, { dataTransfer });
  fireEvent.drop(targetColumn, { dataTransfer });
  fireEvent.dragEnd(card, {
    dataTransfer,
    clientX: 100,
    clientY: 100,
  });

  await waitFor(() => {
    expect(transport.updateDealStage).toHaveBeenCalledOnce();
    expect(transport.updateDealStage).toHaveBeenCalledWith(1, "proposal");
  });
});
