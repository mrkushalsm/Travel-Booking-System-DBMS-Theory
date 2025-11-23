const StatCard = ({ label, value, trend, icon }) => (
  <div className="card bg-base-100 shadow-md">
    <div className="card-body gap-3">
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="w-12 rounded-full bg-primary/10 text-primary">
            <span>{icon}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-base-content/70">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      {trend && <div className="badge badge-outline badge-success">{trend}</div>}
    </div>
  </div>
);

export default StatCard;
