const ExpenseTable = ({ expenses }) => {
  return (
    <div style={styles.container}>
      <h4>Recent Expenses</h4>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index}>
                <td>
                  {new Date(exp.createdAt || exp.date).toLocaleString()}
                </td>
                <td>{exp.category}</td>
                <td>₹{exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    height: "100%",
  },
  tableWrapper: {
    maxHeight: "200px",
    overflowY: "auto",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
};

export default ExpenseTable;
