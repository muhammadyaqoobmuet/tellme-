"use client";
import { signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession();

  console.log(session);
  if (session) {
    return (
      <div className="text-2xl">
        {session?.data?.user?.username}

        <h1 onClick={() => signOut()}>Logout </h1>
      </div>
    );
  }
  return <h1>no session</h1>;
};

export default Dashboard;
