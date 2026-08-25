import StatCards from "../components/StatCards.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import OrdersChart from "../components/OrdersChart.jsx";
import UsersChart from "../components/UsersChart.jsx";

function Overview() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <StatCards />
      <div className="charts-row">
        <OrdersChart />
        <UsersChart />
      </div>
      <RecentActivity />
    </div>
  );
}

export default Overview;