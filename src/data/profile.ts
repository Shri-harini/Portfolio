export const profile = {
  name: "SHRIHARINI",
  fullName: "Shri Harini V",
  lastName: "Venkataramesh",
  title: "Software Development Engineer · Full Stack Developer",
  location: "Madurai, Tamil Nadu, India",
  openToWork: true,
  email: "vshriharini@gmail.com",
  phone: "+91-9345828047",
  linkedin: "https://linkedin.com/in/shri-harini-v",
  github: "https://github.com/Shri-harini",
  resumeUrl: "/resume/Shriharini_Resume.pdf",
  heroSkills: ["Java", "Python", "React", "MERN", "Azure"],
  summary:
    "Software Development Engineer at Zoho Corporation with expertise in full-stack development, data analytics, UI/UX design, and cloud technologies. Proficient in Java, Python, and the MERN stack with hands-on experience building scalable, production-grade applications.",
  whoIAm: {
    text: "Software Development Engineer with experience shipping scalable product features in Java at Zoho Corporation, contributing to 5+ feature releases. Skilled in RESTful APIs, MERN stack development, and UI/UX design — combining strong engineering fundamentals with creative design capabilities to deliver intuitive, high-impact solutions.",
    highlights: ["5+", "92%", "15%", "8.33"],
    tags: [
      "Full Stack",
      "Cloud Native",
      "UI/UX Design",
      "Data Analytics",
      "Problem Solver",
    ],
  },
  stats: [
    { value: "5+", label: "Feature Releases" },
    { value: "92%", label: "Detection Accuracy" },
    { value: "15%", label: "Precision Improvement" },
    { value: "8.33", label: "CGPA Score" },
  ],
  skills: {
    languages: ["Python", "Java", "C++", "HTML", "CSS", "R", "MySQL", "SQL"],
    frameworks: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "MERN Stack",
      "REST APIs",
    ],
    tools: ["Git", "GitHub", "Figma", "Power BI", "MS Office"],
    cloud: [
      "Microsoft Azure",
      "Azure Synapse",
      "Cosmos DB",
      "Snowflake",
      "Generative AI",
    ],
    practices: [
      "OOP",
      "Agile/Scrum",
      "UI/UX Design",
      "Data Science",
      "Unit Testing",
    ],
  },
  education: [
    {
      date: "May 2025",
      degree: "B.E. in Computer Science and Engineering",
      school: "NPR College of Engineering & Technology — Madurai, India",
      score: "CGPA 8.33 / 10",
    },
    {
      date: "May 2021",
      degree: "Senior Secondary (Class XII)",
      school: "Velammal Bodhi Campus — Madurai, India",
      score: "Percentage 86%",
    },
    {
      date: "May 2019",
      degree: "High School (Class X)",
      school: "Velammal Bodhi Campus — Madurai, India",
      score: "Percentage 80%",
    },
  ],
  experience: [
    {
      date: "May 2025 – Mar 2026",
      role: "Software Development Engineer (MTS)",
      company: "Zoho Corporation — Madurai, India",
      points: [
        "Engineered and shipped scalable product features in Java, contributing to 5+ feature releases.",
        "Designed RESTful APIs and optimized backend modules for improved maintainability.",
        "Followed OOP principles and Git workflows; participated in code reviews across the team.",
      ],
    },
    {
      date: "Jul 2024 – Aug 2024",
      role: "UI Design Intern",
      company: "Dot Com Infoway — Madurai, India",
      points: [
        "Designed end-to-end UI/UX prototypes for 2 client-facing applications in Figma.",
        "Applied user-centered design principles, receiving positive client feedback on all prototypes.",
      ],
    },
    {
      date: "Jun 2023 – Jul 2023",
      role: "Web Development Intern",
      company: "Dot Com Infoway — Madurai, India",
      points: [
        "Built responsive web features using HTML, CSS, and JavaScript; delivered 3+ UI components.",
        "Gained exposure to Git, REST API integration, and Agile development practices.",
      ],
    },
  ],
  projects: [
    {
      title: "Vision Shield",
      stack: "Python · Computer Vision · Deep Learning · OpenCV",
      description:
        "Real-time deepfake face detection system achieving ~92% detection accuracy using deep learning models.",
    },
    {
      title: "Worldly — Travel Booking UI",
      stack: "Figma · UI/UX Design · Prototyping",
      description:
        "15+ screen UI/UX prototype for an AI-powered travel booking platform with personalized recommendations.",
    },
    {
      title: "Credit Card Fraud Detection",
      stack: "Python · Scikit-learn · Machine Learning",
      description:
        "Binary classification model for fraudulent transactions; SMOTE and feature engineering improved precision by ~15%.",
    },
  ],
  certifications: [
    "Microsoft Certified: Azure Data Fundamentals (DP-900)",
    "Google AI Essentials Certification",
    "Young Python Professional — Infosys Springboard",
    "Pragati: Path to Future Cohort-3 — Infosys Springboard",
    "Data Analytics Job Simulation — Accenture",
    "Data Visualisation — Tata",
    "Network Essentials — Naan Mudhalvan with CISCO",
  ],
} as const;

export type Profile = typeof profile;
