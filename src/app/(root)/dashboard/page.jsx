"use client";

import { useUserStore } from "@/stores/storeUser";
import { ORGANIZATION, VERIFIER } from "@/libs/constants";
import OrganizationDashboard from "@/components/dashboard/organization";
import VerifierDashboard from "@/components/dashboard/verifier";

const Dashboard = () => {
  const { user } = useUserStore();

  if (user?.role === ORGANIZATION) {
    return <OrganizationDashboard />;
  } else if (user?.role === VERIFIER) {
    return <VerifierDashboard />;
  } else {
    return null;
  }
};

export default Dashboard;
