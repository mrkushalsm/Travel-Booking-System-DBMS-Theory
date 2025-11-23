const DataTable = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="text-base capitalize">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id || row.BookingId || row.PaymentId}>
            {columns.map((col) => (
              <td key={col.key} className="align-top">
                {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
