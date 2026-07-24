"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  DEAL_STAGES,
  type DealBoardDealRead,
  type DealBoardRead,
  type DealRead,
  type DealStage,
  type DemoUser,
  fetchCurrentUser,
  fetchDealBoard,
  isDealStage,
  updateDealStage,
} from "@/lib/api";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export interface PipelineBoardTransport {
  fetchDealBoard: () => Promise<DealBoardRead>;
  fetchCurrentUser: () => Promise<DemoUser>;
  updateDealStage: (
    dealId: number,
    stage: DealStage,
  ) => Promise<DealRead>;
}

const defaultTransport: PipelineBoardTransport = {
  fetchDealBoard,
  fetchCurrentUser,
  updateDealStage,
};

interface PipelineBoardProps {
  transport?: PipelineBoardTransport;
}

export default function PipelineBoard({
  transport = defaultTransport,
}: PipelineBoardProps) {
  const [board, setBoard] = useState<DealBoardRead | null>(null);
  const [owner, setOwner] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [pendingDealIds, setPendingDealIds] = useState<ReadonlySet<number>>(
    new Set(),
  );
  const [draggedDeal, setDraggedDeal] = useState<{
    id: number;
    stage: DealStage;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<DealStage | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [nextBoard, nextOwner] = await Promise.all([
          transport.fetchDealBoard(),
          transport.fetchCurrentUser(),
        ]);
        if (active) {
          setBoard(nextBoard);
          setOwner(nextOwner);
          setLoadError(null);
        }
      } catch (error) {
        if (active) {
          setLoadError(errorMessage(error, "Failed to load the deal pipeline"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [transport]);

  const moveDeal = useCallback(
    async (dealId: number, targetStage: DealStage) => {
      const sourceColumn = board?.columns.find((column) =>
        column.deals.some((deal) => deal.id === dealId),
      );
      if (
        !sourceColumn ||
        sourceColumn.stage === targetStage ||
        pendingDealIds.has(dealId)
      ) {
        return;
      }

      setPendingDealIds((current) => new Set(current).add(dealId));
      setMutationError(null);

      try {
        const updatedDeal = await transport.updateDealStage(
          dealId,
          targetStage,
        );
        setBoard((current) => {
          if (!current) {
            return current;
          }

          const currentDeal = current.columns
            .flatMap((column) => column.deals)
            .find((deal) => deal.id === dealId);
          if (!currentDeal) {
            return current;
          }

          const movedDeal: DealBoardDealRead = {
            ...currentDeal,
            ...updatedDeal,
          };

          return {
            columns: current.columns.map((column) => {
              if (column.stage === sourceColumn.stage) {
                return {
                  ...column,
                  deals: column.deals.filter((deal) => deal.id !== dealId),
                };
              }
              if (column.stage === targetStage) {
                return {
                  ...column,
                  deals: [...column.deals, movedDeal].sort(
                    (left, right) => left.id - right.id,
                  ),
                };
              }
              return column;
            }),
          };
        });
      } catch (error) {
        setMutationError(
          errorMessage(error, "Failed to update the deal stage"),
        );
      } finally {
        setPendingDealIds((current) => {
          const next = new Set(current);
          next.delete(dealId);
          return next;
        });
      }
    },
    [board, pendingDealIds, transport],
  );

  function changeStage(
    dealId: number,
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const targetStage = event.currentTarget.value;
    if (isDealStage(targetStage)) {
      void moveDeal(dealId, targetStage);
    }
  }

  function startDrag(
    event: DragEvent<HTMLElement>,
    dealId: number,
    stage: DealStage,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(dealId));
    setDraggedDeal({ id: dealId, stage });
  }

  function dragOver(event: DragEvent<HTMLElement>, stage: DealStage) {
    if (!draggedDeal || draggedDeal.stage === stage) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTarget(stage);
  }

  function dropDeal(event: DragEvent<HTMLElement>, stage: DealStage) {
    event.preventDefault();
    setDropTarget(null);
    if (draggedDeal) {
      void moveDeal(draggedDeal.id, stage);
      setDraggedDeal(null);
    }
  }

  if (loading) {
    return (
      <div className="pipeline-board__status" role="status" aria-live="polite">
        Loading pipeline…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="pipeline-board__error" role="alert">
        {loadError}
      </div>
    );
  }

  if (!board || !owner) {
    return null;
  }

  return (
    <section className="pipeline-board" aria-label="Deal pipeline">
      {mutationError && (
        <div className="pipeline-board__error" role="alert">
          {mutationError}
        </div>
      )}
      <div className="pipeline-board__scroll">
        <div className="pipeline-board__columns">
          {DEAL_STAGES.map(({ value, label }) => {
            const deals =
              board.columns.find((column) => column.stage === value)?.deals ??
              [];
            const isDropTarget = dropTarget === value;

            return (
              <section
                className={`pipeline-column${
                  isDropTarget ? " pipeline-column--drop-target" : ""
                }`}
                data-testid={`pipeline-column-${value}`}
                key={value}
                aria-label={`${label} stage`}
                onDragOver={(event) => dragOver(event, value)}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(event) => dropDeal(event, value)}
              >
                <div className="pipeline-column__header">
                  <h2>{label}</h2>
                  <span aria-label={`${deals.length} deals`}>
                    {deals.length}
                  </span>
                </div>
                <div className="pipeline-column__deals">
                  {deals.length === 0 ? (
                    <div className="pipeline-column__empty">No deals</div>
                  ) : (
                    deals.map((deal) => {
                      const isPending = pendingDealIds.has(deal.id);

                      return (
                        <article
                          className="pipeline-card"
                          draggable={!isPending}
                          key={deal.id}
                          aria-busy={isPending}
                          onDragStart={(event) =>
                            startDrag(event, deal.id, deal.stage)
                          }
                          onDragEnd={() => {
                            setDraggedDeal(null);
                            setDropTarget(null);
                          }}
                        >
                          <div className="pipeline-card__topline">
                            <span
                              className="pipeline-card__avatar"
                              role="img"
                              aria-label={`Owner: ${owner.name}`}
                            >
                              {initials(owner.name)}
                            </span>
                            <span className="pipeline-card__amount">
                              {currency.format(deal.amount)}
                            </span>
                          </div>
                          <h3>{deal.name}</h3>
                          <p>{deal.account_name}</p>
                          <label className="pipeline-card__stage">
                            Move {deal.name} to stage
                            <select
                              aria-label={`Move ${deal.name} to stage`}
                              disabled={isPending}
                              value={deal.stage}
                              onChange={(event) =>
                                changeStage(deal.id, event)
                              }
                            >
                              {DEAL_STAGES.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                  {stage.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
