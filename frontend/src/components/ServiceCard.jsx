const ServiceCard = ({ title, subtitle, price, meta = [], actionLabel, onAction, actions }) => {
  const numericPrice = Number(price);
  const displayPrice = Number.isFinite(numericPrice)
    ? `₹${numericPrice.toLocaleString('en-IN')}`
    : price ?? '—';

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <div>
          <h3 className="card-title text-lg">{title}</h3>
          <p className="text-base-content/70">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {meta.map((item) => (
            <div key={item} className="badge badge-outline">
              {item}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-semibold text-primary">{displayPrice}</p>
          <div className="flex flex-wrap gap-2">
            {actions}
            {actionLabel && (
              <button className="btn btn-primary btn-sm" onClick={onAction}>
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
