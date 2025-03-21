import { Question } from '@/components/Dates/Dates';
interface QuestionResponse {
  question: number;
  selected_option: {
    id: number;
    text_ru: string;
    text_kg: string;
  } | null;
  multiple_selected_options?: {
    id: number;
    text_ru: string;
    text_kg: string;
  }[];
  custom_answer: string | null;
  answer?: string | undefined;
}

export function processFirstQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  const allCategories =
    language === "ru"
      ? [
          "Стенды с qr кодом",
          "Через официальный сайт ВС",
          "Через портал “Цифрового правосудия КР”",
          "Через WhatsАpp",
          "Через независимых юристов",
          "Через мероприятия, соцролики и соцсети.",
          "Через сотрудников суда",
          "Другое:"
        ]
      : [
          "QR коддуу стенддерден",                  
          "Жогорку Соттун расмий сайты аркылуу",                 
          "Санариптик Адилеттиги порталынан",            
          "WhatsApp аркылуу",                       
          "Көз карандысыз юристтер аркылуу",       
          "Соцроликтер жана соцтармактар аркылуу.",
          "Сот кызматкерлери аркылуу",       
          "Башка:"                                  
        ];

  const validResponses = responses.filter(
    r => r.selected_option !== null && r.custom_answer !== "Необязательный вопрос"
  );

  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = allCategories;
  const data = labels.map(label => grouped[label] ? grouped[label] : 0);

  const sortedEntries = labels
    .map((label, index) => [label, data[index]] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return {
    labels: sortedEntries.map(([label]) => label),
    datasets: [
      {
        data: sortedEntries.map(([_, value]) => value),
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(231, 76, 60)',
          'rgb(142, 68, 173)'
        ],
        barThickness: 20,
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => `${value}`
        },
        label: ""
      }
    ]
  };
}

export function processSecondQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  const allCategories =
    language === "ru"
      ? [
          "Сторона по делу (истец, ответчик, потерпевший, обвиняемый)",
          "Адвокат или представитель стороны",
          "Свидетель",
          "Посетитель (родственник, друг, сосед, коллега одной из сторон и др.)"
        ]
      : [
          "Иш боюнча тарап (доогер, жоопкер, жабырлануучу, айыпталуучу)",
          "Адвокат же тараптын өкүлү",
          "Күбө",
          "Келүүчү   (тууганы, досу, кошунасы, бир тараптын кесиптеши ж.б.)"
        ];

  const validResponses = responses.filter(r => r.selected_option !== null);
  const totalResponses = validResponses.length;

  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = allCategories;
  const data = labels.map(label =>
    grouped[label] ? Math.round((grouped[label] / totalResponses) * 100) : null
  );

  return {
    labels,
    datasets: [
      {
        data: data.map(value => (value !== null ? value : NaN)), 
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(153, 102, 255)'
        ],
        datalabels: {
          color: "#FFFFFF",
          display: true,
          formatter: (value: number): string => (isNaN(value) ? "" : `${value}%`) // Убираем 0%
        }
      }
    ]
  };
}

export function processThirdQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  const allCategories =
    language === "ru" ? ["Женский", "Мужской"] : ["Аял", "Эркек"];

  const validResponses = responses.filter((r) => r.selected_option !== null);
  const totalResponses = validResponses.length;

  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = allCategories;
  const data = labels.map((label) =>
    grouped[label] ? Math.round((grouped[label] / totalResponses) * 100) : NaN
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(51, 153, 255)", 
        ],
        datalabels: {
          color: "#FFFFFF",
          display: true,
          formatter: (value: number): string => (isNaN(value) ? "" : `${value}%`),
        },
      },
    ],
  };
}

export function processFifthQuestion(
  responses: QuestionResponse[],
  language: "ru" | "ky"
) {
  const allCategories =
    language === "ru"
      ? ["Гражданские", "Уголовные", "Административные", "Другое :"]
      : ["Жарандык", "Кылмыш", "Административдик", "Башка:"];

  const validResponses = responses.filter((r) => r.selected_option !== null);
  const totalResponses = validResponses.length;

  const grouped = validResponses.reduce((acc, response) => {
    const optionText =
      language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
    acc[optionText] = (acc[optionText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = allCategories.map((label) => {
    const count = grouped[label] || 0;
    return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
  });

  return {
    labels: allCategories,
    datasets: [
      {
        data, 
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => (value === 0 ? "" : `${value}%`),
        },
        label: "",
      },
    ],
  };
}

export function processAudioVideoQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 13);

  if (question && question.question_responses) {
    const allCategories = language === "ru"
      ? ["Да", "Нет", "Не знаю", "Другое:"]
      : ["Ооба", "Жок", "Билбейм", "Башка:"];

    const validResponses = question.question_responses.filter(
      r => r.selected_option !== null
    );
    const totalResponses = validResponses.length;

    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText = language === "ru"
        ? response.selected_option!.text_ru
        : response.selected_option!.text_kg;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    });

    return {
      labels: allCategories,
      datasets: [{
        data,
        backgroundColor: [
          'rgb(54, 162, 235)',  
          'rgb(255, 99, 132)', 
          'rgb(255, 159, 64)', 
          'rgb(153, 102, 255)' 
        ],
        datalabels: {
          color: "#FFFFFF",
          formatter: (value: number): string => (value === 0 ? "" : `${value}%`), 
        }
      }]
    };
  }

  return {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };
}

export function processProgressRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? {
          11: "Разъяснение прав и обязанности в судебном процессе",
          12: "Контроль судьи за порядком в зале суда",
          14: "Проявление уважения к участникам судебного процесса",
          17: "Общая оценка работы судьи",
        }
      : {
          11: "Сот процессинде укуктарды жана милдеттерди түшүндүрүү",
          12: "Сот залындагы тартипке судьянын көзөмөлү",
          14: "Сот процессинин катышуучуларына урмат көрсөтүү",
          17: "Судьянын ишине жалпы баа берүү",
        };

  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach((title) => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  questions.forEach((question) => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach((response) => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option!.text_ru
              : response.selected_option!.text_kg;
          const rating = Number(ratingStr);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processStaffRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? {
          7: "Отношение сотрудников",
          9: "Предоставление всей необходимой информации"
        }
      : {
          7: "Кызматкерлердин мамилеси",
          9: "Бардык керектүү маалыматтарды берүү"
        };

  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processProcessRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 10: "Оценка судебного процесса" }
      : { 10: "Сот процессине баа берүү" }; 

  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processOfficeRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 8: "Предоставление всей необходимой информации" }
      : { 8: "Бардык керектүү маалыматтарды берүү" }; 

  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processAccessibilityRatings(
  questions: Question[],
  language: "ru" | "ky"
): { [key: string]: number } {
  const questionTitles: { [key: number]: string } =
    language === "ru"
      ? { 6: "Доступность здания суда для людей с инвалидностью и маломобильных категорий" }
      : { 6: "Майыптыгы бар жана аз кыймылдуу категориядагы адамдар үчүн сот имаратынын жеткиликтүүлүгү" }; 

  const ratingSums: { [key: string]: { sum: number; count: number } } = {};
  Object.values(questionTitles).forEach(title => {
    ratingSums[title] = { sum: 0, count: 0 };
  });

  questions.forEach(question => {
    if (questionTitles[question.id]) {
      const title = questionTitles[question.id];
      question.question_responses.forEach(response => {
        if (response.selected_option) {
          const ratingStr =
            language === "ru"
              ? response.selected_option.text_ru
              : response.selected_option.text_kg;
          const rating = Number(ratingStr);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            ratingSums[title].sum += rating;
            ratingSums[title].count += 1;
          }
        }
      });
    }
  });

  const averageRatings: { [key: string]: number } = {};
  Object.entries(ratingSums).forEach(([title, { sum, count }]) => {
    averageRatings[title] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  return averageRatings;
}

export function processStartTimeQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 16);

  if (question && question.question_responses) {
    const allCategories =
      language === "ru"
        ? ["Да", "Нет", "Другое:"]
        : ["Ооба", "Жок", "Башка:"];

    const validResponses = question.question_responses.filter(
      (r: QuestionResponse) => r.selected_option !== null
    );

    const totalResponses = validResponses.length;

    if (totalResponses === 0) {
      return getEmptyStartTimeData();
    }

    const grouped = validResponses.reduce((acc: Record<string, number>, response) => {
      const optionText =
        language === "ru"
          ? response.selected_option!.text_ru
          : response.selected_option!.text_kg;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      return totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    });

    const colors = [
      "rgb(54, 162, 235)",
      "rgb(255, 99, 132)", 
      "rgb(153, 102, 255)" 
    ];

    return {
      labels: allCategories,
      datasets: [
        {
          data,
          backgroundColor: colors,
          datalabels: {
            color: "#FFFFFF",
            formatter: (value: number): string => (value === 0 ? "" : `${value}%`), 
          }
        }
      ]
    };
  }

  return getEmptyStartTimeData();
}



function getEmptyStartTimeData() {
  return {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };
}

export function processDisrespectQuestion(
  questions: Question[],
  language: "ru" | "ky"
) {
  const question = questions.find(q => q.id === 15);

  if (question && question.question_responses) {
    const allCategories =
      language === "ru"
        ? ["Грубость", "Игнорирование", "Не давали выступить", "Другое"]
        : ["Оройлук", "Кайдыгерлик", "Сөз бербей коюу", "Башка:"];

    const validResponses = question.question_responses.filter(
      r => r.multiple_selected_options?.length
    );

    const grouped = validResponses.reduce(
      (acc: Record<string, number>, response) => {
        response.multiple_selected_options!.forEach((option: { id: number; text_ru: string; text_kg: string }) => {
          const optionText = language === "ru" ? option.text_ru : option.text_kg;
          acc[optionText] = (acc[optionText] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    const totalResponses = Object.values(grouped).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalResponses === 0) {
      return getEmptyDisrespectData();
    }

    const data = allCategories.map(category => {
      const count = grouped[category] || 0;
      const percentage = Math.round((count / totalResponses) * 100);
      return { count, percentage };
    });

    return {
      labels: allCategories,
      datasets: [
        {
          data: data.map(d => d.count),
          backgroundColor: "rgb(54, 162, 235)",
          barThickness: 20,
          datalabels: {
            color: "#FFFFFF",
            align: "end",
            anchor: "start",
            offset: 10,
            formatter: (value: number, context: any): string => {
              const percentage = data[context.dataIndex].percentage;
              return `${value} (${percentage}%)`;
            },
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      ],
    };
  }

  return getEmptyDisrespectData();
}

function getEmptyDisrespectData() {
  return {
    labels: ["Грубость", "Игнорирование", "Не давали выступить", "Другое :"],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: 'rgb(200, 200, 200)',
      barThickness: 20,
      datalabels: {
        color: "#000000",
        align: "end",
        anchor: "start",
        offset: 10,
        formatter: () => "0 (0%)",
        font: {
          size: 12,
          weight: "bold"
        }
      }
    }]
  };
}

  export function processAgeData(responses: QuestionResponse[]) {
    const ageGroups = ["18–29", "30–44", "45–59", "60+"];
    const ageCounts = new Array(ageGroups.length).fill(0);

    responses.forEach(response => {
      if (response.selected_option) {
        const ageGroupIndex = response.selected_option.id - 13;
        if (ageGroupIndex >= 0 && ageGroupIndex < ageCounts.length) {
          ageCounts[ageGroupIndex]++;
        }
      }
    });

    return {
      labels: ageGroups,
      datasets: [
        {
          data: ageCounts,
          backgroundColor: [
            "rgb(54, 162, 235)",
            "rgb(255, 99, 132)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
          ],
          datalabels: {
            color: "#FFFFFF",
            formatter: (value: number): string => `${value}`,
          },
        },
      ],
    };
  }

  export function processAgeGenderData(
    genderResponses: QuestionResponse[],
    ageResponses: QuestionResponse[]
  ) {
    const ageGroups = ["18-29", "30-44", "45-59", "60+"];
  
    const groupedData: Record<string, { Мужской: number; Женский: number }> = {
      "18-29": { Мужской: 0, Женский: 0 },
      "30-44": { Мужской: 0, Женский: 0 },
      "45-59": { Мужской: 0, Женский: 0 },
      "60+": { Мужской: 0, Женский: 0 },
    };
  
    for (let i = 0; i < genderResponses.length; i++) {
      const gender = genderResponses[i]?.selected_option?.text_ru;
      let age = ageResponses[i]?.selected_option?.text_ru;
  
      if (age) {
        age = age.replace(/–/g, "-").replace(/\s/g, "");
      }
  
      if (gender && age && ageGroups.includes(age)) {
        groupedData[age][gender as 'Мужской' | 'Женский']++;
      }
    }
  
    const maleData: number[] = [];
    const femaleData: number[] = [];
  
    ageGroups.forEach((age) => {
      const total = groupedData[age]["Мужской"] + groupedData[age]["Женский"];
      const malePercentage = total > 0 ? -Math.round((groupedData[age]["Мужской"] / total) * 100) : 0;
      const femalePercentage = total > 0 ? Math.round((groupedData[age]["Женский"] / total) * 100) : 0;
      maleData.push(malePercentage);
      femaleData.push(femalePercentage);
    });
  
    const hasMaleData = maleData.some((value) => value !== 0); 
    const hasFemaleData = femaleData.some((value) => value !== 0); 
  
    const datasets: Array<{ label: string; data: number[]; backgroundColor: string }> = [];
  
    if (hasMaleData) {
      datasets.push({
        label: "Мужской",
        data: maleData,
        backgroundColor: "rgb(51, 153, 255)",
      });
    }
  
    if (hasFemaleData) {
      datasets.push({
        label: "Женский",
        data: femaleData,
        backgroundColor: "rgb(255, 99, 132)",
      });
    }
  
    if (datasets.length === 0) {
      return {
        labels: ageGroups,
        datasets: [
          {
            label: "Мужской",
            data: ageGroups.map(() => 0),
            backgroundColor: "rgb(51, 153, 255)",
          },
          {
            label: "Женский",
            data: ageGroups.map(() => 0),
            backgroundColor: "rgb(255, 99, 132)",
          },
        ],
      };
    }
  
    return {
      labels: ageGroups, 
      datasets: datasets, 
    };
  }