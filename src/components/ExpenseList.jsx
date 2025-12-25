const ExpenseList = ({ expenses }) => {
  if (expenses.length === 0) {
    return <p style={{ color: "#666" }}>No expenses added yet.</p>;
  }

  return (
    <div>
      <h3>Your Expenses</h3>
      {expenses.map((exp) => (
        <div key={exp._id} style={styles.card}>
          <div>
            <strong>{exp.title}</strong>
            <p style={styles.category}>{exp.category}</p>
          </div>
          <div style={styles.amount}>₹{exp.amount}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  category: {
    fontSize: "12px",
    color: "#666",
  },
  amount: {
    fontWeight: "bold",
    color: "#0f172a",
  },
};

export default ExpenseList;
