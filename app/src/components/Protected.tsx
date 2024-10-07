"use client"
// import { useRouter } from "next/router";
// import React, { useEffect } from "react";
// import { useAuth } from "@context/AuthContext";
import { useUser } from "@context/UserStateContext";
import { redirect } from "next/navigation";


type Props = {
  children: React.ReactNode;
  on?: boolean;
};

export const Component = ({ children, on=true }: Props) => {
  const { isLoading, isAuthenticated } = useUser();

  if ((isAuthenticated && !isLoading) || !on) {
    return <>{children}</>;
  }
  return <></>;
};

export function Route({ children }: Props) {
  // const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  // if (loading) return <h1>Loading</h1>;

  if(!isAuthenticated && !isLoading) {
    redirect("/bienvenido")
  }

  return <>{children}</>;
}

export const Statement = ({ someCode }: any) => {
  const { isLoading, isAuthenticated } = useUser();

  if (isAuthenticated && !isLoading) {
    return someCode;
  }
};

const Protected = {
  Component,
  Route,
  Statement,
};

export default Protected;
