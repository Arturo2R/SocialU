import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "@context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export const Component = ({ children }: Props) => {
  const { user } = useAuth();

  if (user) {
    return <>{children}</>;
  }
  return <></>;
};

export function Route({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();
  // if (loading) return <h1>Loading</h1>;

  useEffect(() => {
    if (!user && !loading) {
      //if (!user) {
      router.push("/bienvenido");
    }
  }, [user, loading]);

  return <>{children}</>;
}

export const Statement = ({ someCode }: any) => {
  const { user } = useAuth();

  if (user) {
    return someCode;
  }
};

const Protected = {
  Component,
  Route,
  Statement,
};

export default Protected;
