"use client";

import React, { useEffect, useState } from "react";
import { getAssessmentData, getCookie } from "@/lib/api/login";
import Dates from "@/components/Dates/Dates";
import Instance2 from "@/components/roles/2 instance";
import { getTranslation, useSurveyData } from "@/context/SurveyContext";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import RegionMap, { RegionData } from "@/components/Maps/RegionMap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Assessment {
  aspect: string;
  court_avg: number;
  assessment_count: string;
}

interface CourtData {
  court_id: number;
  court: string;
  instantiation: string;
  overall_assessment: number;
  assessment: Assessment[];
  assessment_count: string;
  total_survey_responses: number;
}

const FirstInstance = () => {
  const [assessmentData, setAssessmentData] = useState<CourtData[]>([]);
  const {courtName, setCourtName, setSurveyData, setIsLoading, selectedCourt, setSelectedCourt } = useSurveyData();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const {language, } = useSurveyData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const token = getCookie("access_token");
        if (!token) {
          throw new Error("Token is null");
        }
        const data = await getAssessmentData();
        setAssessmentData(data.courts);
      } catch (error) {
        console.error("Ошибка при получении данных оценки:", error);
      }
    };

    fetchAssessmentData();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("https://opros.sot.kg/api/v1/current_user/", {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        });
        const data = await response.json();
        setCurrentUser(data);
        
        if (data.role === "Председатель 2 инстанции") {
          const regionName = getRegionFromCourt(data.court);
          setUserRegion(regionName);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField("");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc")
      return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const getRegionFromCourt = (userCourt: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласский областной суд": "Таласская область",
      "Иссык-кульский областной суд": "Иссык-Кульская область",
      "Нарынский областной суд": "Нарынская область",
      "Баткенский областной суд": "Баткенская область",
      "Чуйский областной суд": "Чуйская область",
      "Ошский областной суд": "Ошская область",
      "Жалал-Абадский областной суд": "Жалал-Абадская область",
      "Бишкекский городской суд": "Бишкек",
    };
    return regionMap[userCourt] || "";
  };

  const getRegionSlug = (userRegion: string): string => {
    const regionMap: { [key: string]: string } = {
      "Таласская область": "Talas",
      "Иссык-Кульская область": "Issyk-Kyl",
      "Нарынская область": "Naryn",
      "Баткенская область": "Batken",
      "Чуйская область": "Chyi",
      "Ошская область": "Osh",
      "Жалал-Абадская область": "Djalal-Abad",
      "Бишкек": "Bishkek",
    };
    
    return regionMap[userRegion] || "";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const filteredCourts = Array.isArray(assessmentData) 
    ? assessmentData.filter((court) => {
        return searchQuery === "" || 
          court.court.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  // Сортировка
  const sortedCourts = [...filteredCourts].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    if (sortField === "overall") {
      valueA = a.overall_assessment;
      valueB = b.overall_assessment;
    } else {
      const aspectA = a.assessment.find(assess => assess.aspect === sortField);
      const aspectB = b.assessment.find(assess => assess.aspect === sortField);
      valueA = aspectA ? aspectA.court_avg : 0;
      valueB = aspectB ? aspectB.court_avg : 0;
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const getRatingColorClass = (rating: number) => {
    if (rating === 0) return "bg-gray-100";
    if (rating < 2) return "bg-red-100";
    if (rating < 2.5) return "bg-red-100";
    if (rating < 3) return "bg-orange-100";
    if (rating < 3.5) return "bg-yellow-100";
    if (rating < 4) return "bg-emerald-100";
    return "bg-green-100";
  };

  const transformCourtData = (courts: CourtData[]): RegionData[] => {
    const transformedData: RegionData[] = [];
    
    courts.forEach((court) => {
      if (court.court_id) {
        transformedData.push({
          id: court.court_id,
          name: court.court,
          ratings: [
            court.assessment.find(a => a.aspect === "Судья")?.court_avg || 0,
            court.assessment.find(a => a.aspect === "Сотрудники")?.court_avg || 0,
            court.assessment.find(a => a.aspect === "Процесс")?.court_avg || 0,
            court.assessment.find(a => a.aspect === "Канцелярия")?.court_avg || 0,
            court.assessment.find(a => a.aspect === "Здание")?.court_avg || 0
          ],
          overall: court.overall_assessment,
          totalAssessments: Number(court.assessment_count) || 0
        });
      }
    });
    
    return transformedData;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentUser?.role === "Председатель 2 инстанции" && (
        <div className="max-w-[1250px] mx-auto px-4 py-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold leading-none py-2">{userRegion}</h2>
              
              {currentUser?.role === "Председатель 2 инстанции" && (
                <button
                  onClick={() => {
                    const regionSlug = getRegionSlug(userRegion || "");
                    router.push(`/Home/first_instance/feedbacks/${regionSlug}`);
                  }}
                  className="px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 shadow-sm transition-all duration-200 leading-none"
                >
                  {getTranslation("RemarksLogic_Remarks", language)}
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <RegionMap
                regionName={userRegion || ""}
                selectedRegion={transformCourtData(assessmentData)}
                onCourtClick={(courtId: number, courtName: string) => {
                  const selectedCourt = assessmentData.find(
                    (court) => court.court_id === courtId
                  );
                  if (selectedCourt) {
                    router.push(`/Home/first_instance/court/${courtId}`);
                  }
                }}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                        №
                      </th>
                      <th
                        className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 w-56 min-w-[14rem]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate mr-2">{getTranslation("Regional_Courts_Table_NameRegion", language)}</span>
                          <div className="relative">
                            <div
                              className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${
                                isSearchOpen ? "w-36" : "w-8"
                              }`}
                            >
                              <div
                                className={`flex-grow transition-all duration-500 ease-in-out ${
                                  isSearchOpen ? "opacity-100 w-full" : "opacity-0 w-0"
                                }`}
                              >
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Поиск суда"
                                  className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg outline-none"
                                  autoFocus={isSearchOpen}
                                />
                              </div>
                              <div
                                className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-full flex-shrink-0"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                              >
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">
                        Инстанция
                      </th>
                      <th 
                        className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                        onClick={() => handleSort("overall")}
                      >
                        <div className="flex items-center justify-between px-2">
                        {getTranslation("Regional_Courts_Table_Overall", language)}
                        {getSortIcon("overall")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                        onClick={() => handleSort("judge")}
                      >
                        <div className="flex items-center justify-between px-2">
                        {getTranslation("Regional_Courts_Table_Judge", language)}
                          {getSortIcon("judge")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                        onClick={() => handleSort("process")}
                      >
                        <div className="flex items-center justify-between px-2">
                        {getTranslation("Regional_Courts_Table_Procces", language)}
                          {getSortIcon("process")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                        onClick={() => handleSort("staff")}
                      >
                        <div className="flex items-center justify-between px-2">
                        {getTranslation("Regional_Courts_Table_Staff", language)}
                          {getSortIcon("staff")}
                        </div>
                      </th>
                      <th 
                        className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer"
                        onClick={() => handleSort("office")}
                      >
                        <div className="flex items-center justify-between px-2">
                        {getTranslation("Regional_Courts_Table_Building", language)}
                          {getSortIcon("office")}
                        </div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50">
                      {getTranslation("Regional_Courts_Table_NumberResponses", language)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedCourts.map((court, index) => {
                      const judgeRating = court.assessment.find(item => item.aspect === "Судья")?.court_avg || 0;
                      const processRating = court.assessment.find(item => item.aspect === "Процесс")?.court_avg || 0;
                      const staffRating = court.assessment.find(item => item.aspect === "Сотрудники")?.court_avg || 0;
                      const officeRating = court.assessment.find(item => item.aspect === "Канцелярия")?.court_avg || 0;
                      const buildingRating = court.assessment.find(item => item.aspect === "Здание")?.court_avg || 0;
                      
                      return (
                        <tr key={court.court_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500 border-r border-gray-200">
                            {index + 1}
                          </td>
                          <td 
                            className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 cursor-pointer hover:text-blue-600"
                            onClick={() => router.push(`/Home/first_instance/court/${court.court_id}`)}
                          >
                            {court.court}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {court.instantiation}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200 ${getRatingColorClass(court.overall_assessment)}`}>
                            {court.overall_assessment.toFixed(1)}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200 ${getRatingColorClass(judgeRating)}`}>
                            {judgeRating.toFixed(1)}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200 ${getRatingColorClass(processRating)}`}>
                            {processRating.toFixed(1)}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200 ${getRatingColorClass(staffRating)}`}>
                            {staffRating.toFixed(1)}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200 ${getRatingColorClass(buildingRating)}`}>
                            {buildingRating.toFixed(1)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                            {court.total_survey_responses}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FirstInstance; 