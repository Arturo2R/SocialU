import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
// import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  if (loading) return <h1>Loading</h1>;

  // useEffect(() => {
  if (!user) {
    router.push("/welcome");
  }
  // }, [user, loading]);

  return <>{children}</>;
}
