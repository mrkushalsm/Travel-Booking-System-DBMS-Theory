const EmptyState = ({ title = 'No data', message = 'Try adjusting your filters.' }) => (
  <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-300 p-8 text-center">
    <div className="text-4xl">🧭</div>
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-base-content/70">{message}</p>
  </div>
);

export default EmptyState;
