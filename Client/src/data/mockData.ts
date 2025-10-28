import { Chart, ChartCodes } from "@/types/chart";

export const mockCharts: Chart[] = [
  {
    id: "chart-001",
    name: "Chart 001",
    patientName: "John Doe",
    date: "2025-10-10",
    approved: false,
    content: `Patient presents with acute bronchitis and persistent cough for 5 days.
    
Physical Examination:
- Temperature: 101.2°F
- Respiratory rate: 22/min
- Chest auscultation: Bilateral wheezes
- No signs of respiratory distress

Assessment:
Acute bronchitis, likely viral etiology

Plan:
- Prescribed albuterol inhaler
- Advised increased fluid intake
- Follow-up in 7 days if symptoms persist`,
  },
  {
    id: "chart-002",
    name: "Chart 002",
    patientName: "Jane Smith",
    date: "2025-10-11",
    approved: true,
    content: `Annual wellness visit for 45-year-old female.

Review of Systems:
- No active complaints
- Regular exercise routine
- Balanced diet

Physical Examination:
- BP: 118/76
- HR: 72 bpm
- BMI: 23.4

Labs Ordered:
- Complete metabolic panel
- Lipid panel
- HbA1c

Assessment:
Healthy adult, preventive care visit

Plan:
- Continue current lifestyle
- Return for lab results discussion`,
  },
  {
    id: "chart-003",
    name: "Chart 003",
    patientName: "Robert Johnson",
    date: "2025-10-12",
    approved: false,
    content: `Follow-up visit for Type 2 Diabetes management.

Current Medications:
- Metformin 1000mg BID
- Atorvastatin 20mg daily

Recent Labs:
- HbA1c: 7.2%
- Fasting glucose: 142 mg/dL
- LDL: 98 mg/dL

Assessment:
Type 2 Diabetes, adequately controlled

Plan:
- Continue current medications
- Reinforce dietary recommendations
- Recheck HbA1c in 3 months`,
  },
];

export const mockChartCodes: Record<string, ChartCodes> = {
  "chart-001": {
    chartId: "chart-001",
    cptCodes: [
      {
      code: "99213",
        description: "Office or other outpatient visit for the evaluation and management of an established patient",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Patient presents for established visit with low complexity condition",
            auditTrail: "Physical Examination, Assessment, Plan sections indicate routine follow-up",
            modifiers: ["25"]
          },
          llm2: {
            suggested: true,
            reasoning: "Straightforward acute condition requiring minimal medical decision making",
            auditTrail: "acute bronchitis, prescribed albuterol inhaler, Follow-up in 7 days",
            modifiers: ["25"]
          },
          llm3: {
            suggested: true,
            reasoning: "Level 3 visit appropriate for uncomplicated bronchitis",
            auditTrail: "Temperature: 101.2°F, Bilateral wheezes, Prescribed albuterol",
            modifiers: ["25", "57"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
      {
        code: "94640",
        description: "Pressurized or nonpressurized inhalation treatment for acute airway obstruction",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Albuterol inhaler prescribed for bronchospasm",
            auditTrail: "Prescribed albuterol inhaler, Bilateral wheezes",
            modifiers: ["59"]
          },
          llm2: {
            suggested: false,
            reasoning: "Inhaler prescribed but no in-office treatment documented",
            auditTrail: "No administration documented in visit",
            modifiers: []
          },
          llm3: {
            suggested: true,
            reasoning: "Treatment indicated for airway obstruction",
            auditTrail: "Bilateral wheezes, albuterol inhaler",
            modifiers: ["59"]
          }
        },
        selected: false,
        feedback: "",
        customModifiers: [],
      },
    ],
    icdCodes: [
      {
        code: "J20.9",
        description: "Acute bronchitis due to unspecified organism",
      llmSuggestions: {
        llm1: { suggested: true, reasoning: "Primary diagnosis clearly stated in assessment", auditTrail: "Assessment: Acute bronchitis, likely viral etiology", modifiers: ["A"] },
        llm2: { suggested: true, reasoning: "Main condition documented with supporting symptoms", auditTrail: "acute bronchitis, persistent cough for 5 days, Bilateral wheezes", modifiers: [] },
        llm3: { suggested: true, reasoning: "Principal diagnosis for this encounter", auditTrail: "Acute bronchitis, Chest auscultation: Bilateral wheezes", modifiers: ["A", "7P"] },
      },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
      {
        code: "R05.9",
        description: "Cough, unspecified - symptom code for persistent coughing",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Persistent cough is documented symptom",
            auditTrail: "persistent cough for 5 days",
            modifiers: ["D"]
          },
          llm2: {
            suggested: true,
            reasoning: "Chief complaint warrants separate coding",
            auditTrail: "presents with acute bronchitis and persistent cough",
            modifiers: ["D"]
          },
          llm3: {
            suggested: false,
            reasoning: "Symptom included in primary diagnosis",
            auditTrail: "Cough is symptom of bronchitis, not separate condition",
            modifiers: []
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
      {
        code: "R50.9",
        description: "Fever, unspecified - elevated body temperature",
        llmSuggestions: {
          llm1: {
            suggested: false,
            reasoning: "Fever is part of bronchitis presentation",
            auditTrail: "Temperature documented but not separate diagnosis",
            modifiers: []
          },
          llm2: {
            suggested: true,
            reasoning: "Elevated temperature documented",
            auditTrail: "Temperature: 101.2°F",
            modifiers: ["S"]
          },
          llm3: {
            suggested: true,
            reasoning: "Significant fever present",
            auditTrail: "Temperature: 101.2°F",
            modifiers: ["S", "D"]
          }
        },
        selected: false,
        feedback: "",
        customModifiers: [],
      },
    ],
  },
  "chart-002": {
    chartId: "chart-002",
    cptCodes: [
      {
        code: "99395",
        description: "Periodic comprehensive preventive medicine reevaluation and management, established patient, age 40-64 years",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Annual wellness visit for 45-year-old patient",
            auditTrail: "Annual wellness visit for 45-year-old female",
            modifiers: ["33"]
          },
          llm2: {
            suggested: true,
            reasoning: "Preventive care visit with appropriate age range",
            auditTrail: "45-year-old female, preventive care visit",
            modifiers: []
          },
          llm3: {
            suggested: true,
            reasoning: "Comprehensive preventive exam documented",
            auditTrail: "Review of Systems, Physical Examination, Labs Ordered",
            modifiers: ["33"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
      {
        code: "80053",
        description: "Comprehensive metabolic panel - blood chemistry analysis including glucose, electrolytes, and kidney function tests",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Lab panel ordered during visit",
            auditTrail: "Complete metabolic panel",
            modifiers: ["91"]
          },
          llm2: {
            suggested: true,
            reasoning: "Metabolic panel in lab orders",
            auditTrail: "Labs Ordered: Complete metabolic panel",
            modifiers: ["90"]
          },
          llm3: {
            suggested: false,
            reasoning: "Panel ordered but not performed during visit",
            auditTrail: "Labs Ordered section indicates future procedure",
            modifiers: []
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
    ],
    icdCodes: [
      {
        code: "Z00.00",
        description: "Encounter for general adult medical examination without abnormal findings",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Primary reason for wellness visit",
            auditTrail: "Annual wellness visit, Healthy adult, preventive care visit",
            modifiers: ["A", "Z"]
          },
          llm2: {
            suggested: true,
            reasoning: "General examination encounter documented",
            auditTrail: "general adult medical examination, No active complaints",
            modifiers: []
          },
          llm3: {
            suggested: true,
            reasoning: "Preventive care encounter code appropriate",
            auditTrail: "Assessment: Healthy adult, preventive care visit",
            modifiers: ["A"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
    ],
  },
  "chart-003": {
    chartId: "chart-003",
    cptCodes: [
      {
        code: "99214",
        description: "Office or other outpatient visit for the evaluation and management of an established patient with moderate complexity medical decision making",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Chronic disease management requires moderate complexity",
            auditTrail: "Follow-up visit for Type 2 Diabetes management, medication review, labs",
            modifiers: ["25"]
          },
          llm2: {
            suggested: true,
            reasoning: "Multiple medication review and lab interpretation",
            auditTrail: "Current Medications, Recent Labs, Continue current medications",
            modifiers: ["25", "AI"]
          },
          llm3: {
            suggested: true,
            reasoning: "Moderate medical decision making for diabetes follow-up",
            auditTrail: "HbA1c: 7.2%, medication management, dietary recommendations",
            modifiers: ["25"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
    ],
    icdCodes: [
      {
        code: "E11.9",
        description: "Type 2 diabetes mellitus without complications - chronic metabolic disorder characterized by hyperglycemia",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Primary diagnosis for this encounter",
            auditTrail: "Follow-up visit for Type 2 Diabetes, adequately controlled",
            modifiers: ["A", "9"]
          },
          llm2: {
            suggested: true,
            reasoning: "Type 2 diabetes documented without complications",
            auditTrail: "Type 2 Diabetes management, HbA1c: 7.2%, adequately controlled",
            modifiers: ["A"]
          },
          llm3: {
            suggested: true,
            reasoning: "Main condition being managed",
            auditTrail: "Assessment: Type 2 Diabetes, adequately controlled",
            modifiers: ["A"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
      {
        code: "E78.5",
        description: "Hyperlipidemia, unspecified - elevated cholesterol and/or triglycerides",
        llmSuggestions: {
          llm1: {
            suggested: true,
            reasoning: "Patient on statin therapy",
            auditTrail: "Atorvastatin 20mg daily, LDL: 98 mg/dL",
            modifiers: ["D", "S"]
          },
          llm2: {
            suggested: false,
            reasoning: "LDL within normal range, no active diagnosis",
            auditTrail: "LDL: 98 mg/dL is controlled",
            modifiers: []
          },
          llm3: {
            suggested: true,
            reasoning: "Chronic condition under management",
            auditTrail: "Atorvastatin medication, lipid panel monitoring",
            modifiers: ["D"]
          }
        },
        selected: true,
        feedback: "",
        customModifiers: [],
      },
    ],
  },
};
