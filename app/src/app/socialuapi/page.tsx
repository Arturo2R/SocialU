"use client"
// pages/redoc.js
import { RedocStandalone } from 'redoc';

const RedocPage = () => (
    <RedocStandalone specUrl="/convex-spec.yaml"  />
);

export default RedocPage;