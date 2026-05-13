import { englishPracticeModules } from "./englishQuestionBank.js";

export const satPractice = {
  math: [
    {
      domain: "Algebra",
      skill: "Linear functions",
      prompt:
        "If f(x) = x + 5 and g(x) = 3x, what is the value of 2f(4) - g(4)?",
      choices: ["10", "6", "14", "18"],
      answer: 1,
      explanation:
        "Thinking path: Evaluate each function before combining them. First find f(4) = 4 + 5 = 9 and g(4) = 3(4) = 12. Then 2f(4) - g(4) = 2(9) - 12 = 6. Trap check: 10, 14, and 18 come from skipping the coefficient, using only one function, or adding when the expression asks for subtraction.",
    },
    {
      domain: "Problem-Solving and Data Analysis",
      skill: "Percentages",
      prompt:
        "In a club, 45% of members study math. Of those math students, 20% also study computer science. What percent of the club studies both?",
      choices: ["20%", "25%", "9%", "65%"],
      answer: 2,
      explanation:
        "Thinking path: The phrase 'of those math students' means take a percent of a percent. Multiply 0.20 x 0.45 = 0.09, so 9% of the whole club studies both. Trap check: 20% and 45% describe separate groups, and 65% adds percentages that should be multiplied.",
    },
    {
      domain: "Advanced Math",
      skill: "Quadratic features",
      prompt:
        "The function h is defined by h(x) = (x - 3)^2 + 11. What is the minimum value of h?",
      choices: ["20", "3", "11", "8"],
      answer: 2,
      explanation:
        "Thinking path: Recognize vertex form. A quadratic written as a(x - h)^2 + k has minimum value k when a is positive. Here k = 11, so the minimum value is 11. Trap check: 3 is the x-value where the minimum happens, not the minimum output.",
    },
    {
      domain: "Geometry and Trigonometry",
      skill: "Similar triangles",
      prompt:
        "A 12-foot pole casts a 6-foot shadow. At the same time, a nearby sign casts a 4-foot shadow. How tall is the sign?",
      choices: ["10 ft", "2 ft", "4 ft", "8 ft"],
      answer: 3,
      explanation:
        "Thinking path: Same sun angle means the triangles are similar, so the height-to-shadow ratio stays constant. The pole's ratio is 12/6 = 2. The sign's height is 2 x 4 = 8 feet. Trap check: do not add or subtract the shadows; use a ratio.",
    },
  ],
};


export const satEnglishPractice = { modules: englishPracticeModules };

export const pythonSteps = [
  {
    line: "scores = [720, 680, 750]",
    output: "Create a list with three SAT section scores.",
    memory: "scores -> [720, 680, 750]",
  },
  {
    line: "total = sum(scores)",
    output: "Add every value in the list.",
    memory: "total -> 2150",
  },
  {
    line: "average = total / len(scores)",
    output: "Divide the total by the number of scores.",
    memory: "average -> 716.67",
  },
  {
    line: "print(round(average))",
    output: "717",
    memory: "Printed rounded average.",
  },
];

export const dsaArray = [7, 3, 9, 2, 6];

export const mathVisualizationPresets = [
  {
    title: "Function value",
    expression: "f(x) = x + 5",
    detail: "Evaluate by substituting the input for x.",
    x: 4,
    result: 9,
  },
  {
    title: "Percent of a percent",
    expression: "20% of 45%",
    detail: "Multiply decimals: 0.20 x 0.45 = 0.09.",
    x: 45,
    result: 9,
  },
  {
    title: "Similarity ratio",
    expression: "12/6 = h/4",
    detail: "Use equal height-to-shadow ratios.",
    x: 4,
    result: 8,
  },
];
