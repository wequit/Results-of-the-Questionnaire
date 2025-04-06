"use client";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCourt } from "@/context/CourtContext";
import { useChartData } from "@/context/ChartDataContext";
import { useEffect, useState } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import Dates from "@/components/Dates/Dates";
import Evaluations from "@/components/Evaluations/page";
import CourtDataFetcher from "@/lib/api/CourtAPI";

const CourtRatingPage = () => {
  const params = useParams();
  const courtId = params?.courtId as string;

  const {  getTranslation } = useLanguage();
  const { courtName, setCourtName, courtNameId, setCourtNameId } = useCourt();
  const { setIsLoading, radarData: surveyData } = useChartData();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    window.history.back();
  };

  useEffect(() => {
    const loadCourtMetadata = async () => {
      if (!courtId) {
        setError("ID суда не указан в URL");
        setIsDataLoading(false);
        return;
      }

      const storedCourtName = localStorage.getItem("courtName") || courtName;
      const storedCourtId = localStorage.getItem("courtNameId") || courtId;

      if (storedCourtId === courtId && storedCourtName && courtNameId) {
        setIsDataLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsDataLoading(true);

        const newCourtName = storedCourtName || surveyData?.court || "Неизвестный суд";

        setCourtName(newCourtName);
        setCourtNameId(courtId);
        localStorage.setItem("courtNameId", courtId);
        localStorage.setItem("courtName", newCourtName);
        localStorage.setItem("selectedCourtName", newCourtName);

        setError(null);
      } catch (error) {
        console.error("Ошибка при установке метаданных суда:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
        if (courtId) {
          setCourtNameId(courtId);
          setCourtName(storedCourtName || "Неизвестный суд (данные недоступны)");
          localStorage.setItem("courtNameId", courtId);
          localStorage.setItem("courtName", storedCourtName || "Неизвестный суд (данные недоступны)");
        }
      } finally {
        setIsLoading(false);
        setIsDataLoading(false);
      }
    };

    loadCourtMetadata();
  }, [courtId, courtName, setCourtName, courtNameId, setCourtNameId, setIsLoading, surveyData]);

  if (isDataLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-3 mt-4">
        <Breadcrumb
          regionName={getTranslation("HeaderNavFour")}
          courtName={courtName}
          onCourtBackClick={handleBackClick}
          showHome={false}
        />
        <h2 className="text-3xl font-bold mb-4 mt-4 DistrictEvaluationsCourtName">{courtName || "Ошибка"}</h2>
        <div className="text-red-500">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-3 mt-4">
      <Breadcrumb
        regionName={getTranslation("HeaderNavFour")}
        courtName={courtName}
        onCourtBackClick={handleBackClick}
        showHome={false}
      />
      <h2 className="text-3xl font-bold mb-4 mt-4 DistrictEvaluationsCourtName">{courtName}</h2>
      <Dates />
      <CourtDataFetcher courtId={courtId} />
      <Evaluations courtNameId={courtNameId} />
    </div>
  );
};

export default CourtRatingPage;