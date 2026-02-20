import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your learning progress will appear here 📊</p>

      <Link to="/">
        <button>Back to Learn</button>
      </Link>
    </div>
  );
}

export default Dashboard;
