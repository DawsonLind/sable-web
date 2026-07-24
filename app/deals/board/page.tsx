import PipelineBoard from "./pipeline-board";

export default function DealBoardPage() {
  return (
    <main className="pipeline-page">
      <div className="pipeline-page__heading">
        <div>
          <p className="pipeline-page__eyebrow">Deals</p>
          <h1>Pipeline</h1>
        </div>
        <p>Move deals between stages as work progresses.</p>
      </div>
      <PipelineBoard />
    </main>
  );
}
