import React from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  

  return (
    <div>
      <p>Dashboard</p>
    </div>
  );
};

export default Dashboard;
