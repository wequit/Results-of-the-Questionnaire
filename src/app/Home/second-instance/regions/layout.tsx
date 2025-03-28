"use client";

import Header from "@/components/layout/Header";
import { SurveyProvider } from "@/context/SurveyContext";
import  '@/styles/responsive/responsiveRegion.css'

export default function RegionalCourtsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurveyProvider>
          <Header />
      <div className="max-w-[1250px] mx-auto Region">{children}</div>
    </SurveyProvider>
  );
}
