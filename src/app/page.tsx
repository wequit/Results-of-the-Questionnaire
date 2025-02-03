"use client";
import React, { useEffect, useState } from "react";
import Dates from "@/lib/utils/Dates";
import Evaluations from "@/app/evaluations/page";
import DataFetcher from "@/components/DataFetcher";
import { useAuth } from "@/lib/utils/AuthContext";
import SecondInstance from "@/components/roles/2 instance";
import ThirdInstance from "@/components/roles/3 instance ";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {user?.role === "Председатель 1 инстанции" ? (
        <>
          <Dates />
          <DataFetcher />
          <Evaluations />
        </>
      ) : user?.role === "Председатель 2 инстанции" ? (
        <SecondInstance />
      ) : user?.role === "Председатель 3 инстанции" ? (
        <ThirdInstance />
      ) : null}
    </div>
  );
}