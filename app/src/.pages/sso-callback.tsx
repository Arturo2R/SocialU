import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import React from 'react';

export default function SSOCallBack() {
  return <AuthenticateWithRedirectCallback />;
}