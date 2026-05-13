export const courseCatalog = {
  math: {
    title: "SAT Math Foundations",
    category: "SAT",
    image: "/digitalsatmath.jpeg",
    summary:
      "A focused SAT math path for algebra, functions, geometry, data analysis, and question strategy.",
    level: "Beginner to Intermediate",
    duration: "6 lessons",
    studyNote: "Organized around the major SAT Math skill areas students see on test day.",
    bestFor: ["SAT Math", "NEB support", "Concept review"],
    lessons: [
      {
        title: "Linear Equations and Systems",
        focus: "Translate word problems into equations and solve systems efficiently.",
        activity: "Compare substitution and elimination on the same SAT-style prompt.",
      },
      {
        title: "Functions and Graphs",
        focus: "Read function notation, intercepts, slope, and graph behavior.",
        activity: "Sketch how changing coefficients shifts a line or parabola.",
      },
      {
        title: "Quadratics",
        focus: "Use factoring, vertex form, and discriminants to reason about solutions.",
        activity: "Predict roots before calculating them.",
      },
      {
        title: "Geometry and Trigonometry",
        focus: "Review area, volume, angles, similar triangles, and right-triangle ratios.",
        activity: "Break a compound shape into smaller known shapes.",
      },
      {
        title: "Data Analysis",
        focus: "Interpret tables, scatterplots, percentages, probability, and statistics.",
        activity: "Choose the best chart for a dataset and explain why.",
      },
      {
        title: "SAT Strategy Review",
        focus: "Recognize common traps and decide when to use Desmos, elimination, or algebra.",
        activity: "Create a one-page formula and strategy checklist.",
      },
    ],
    outcomes: [
      "Recognize common SAT math problem types",
      "Solve questions with cleaner step-by-step reasoning",
      "Know when to use algebra, graphs, or estimation",
    ],
  },
  english: {
    title: "Digital SAT English",
    category: "SAT",
    image: "/digitalsatenglish.jpeg",
    summary:
      "A reading and writing path for grammar, transitions, evidence, vocabulary, and concise SAT explanations.",
    level: "Beginner to Intermediate",
    duration: "6 lessons",
    studyNote: "Organized around the major SAT Reading and Writing skill areas students see on test day.",
    bestFor: ["Reading and Writing", "Grammar", "Vocabulary"],
    lessons: [
      {
        title: "Words in Context",
        focus: "Use surrounding evidence to select precise vocabulary.",
        activity: "Underline context clues before choosing an answer.",
      },
      {
        title: "Command of Evidence",
        focus: "Choose claims and evidence that directly support the passage.",
        activity: "Match each answer choice to the sentence it depends on.",
      },
      {
        title: "Transitions",
        focus: "Identify contrast, continuation, cause-effect, and sequence relationships.",
        activity: "Label the relationship before looking at choices.",
      },
      {
        title: "Boundaries",
        focus: "Review punctuation, clauses, commas, semicolons, and sentence structure.",
        activity: "Split each sentence into independent and dependent clauses.",
      },
      {
        title: "Form, Structure, and Sense",
        focus: "Choose grammar that fits the sentence logically and grammatically.",
        activity: "Read the sentence without modifiers to find the core structure.",
      },
      {
        title: "Rhetorical Synthesis",
        focus: "Use notes to answer the specific goal in the prompt.",
        activity: "Circle the audience and purpose before reading the notes.",
      },
    ],
    outcomes: [
      "Explain why an answer is correct using textual evidence",
      "Apply grammar rules without memorizing every edge case",
      "Approach English questions with a repeatable process",
    ],
  },
  python: {
    title: "Python Programming",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A beginner-friendly programming track focused on syntax, problem solving, automation, and practical projects.",
    level: "Beginner",
    duration: "6 lessons",
    studyNote: "Built from practical Python fundamentals and beginner project patterns.",
    bestFor: ["New programmers", "Automation basics", "Project practice"],
    lessons: [
      {
        title: "Setup and First Programs",
        focus: "Install Python, run scripts, and understand print/input.",
        activity: "Build a small calculator script.",
      },
      {
        title: "Data Types and Collections",
        focus: "Use strings, numbers, lists, tuples, dictionaries, and sets.",
        activity: "Store quiz questions in a dictionary.",
      },
      {
        title: "Control Flow",
        focus: "Write conditionals and loops for repeatable logic.",
        activity: "Create a score tracker with feedback.",
      },
      {
        title: "Functions and Modules",
        focus: "Organize reusable code and import standard libraries.",
        activity: "Refactor repeated quiz logic into functions.",
      },
      {
        title: "Files and Errors",
        focus: "Read/write files and handle exceptions gracefully.",
        activity: "Save user progress to a text or JSON file.",
      },
      {
        title: "Mini Project",
        focus: "Combine fundamentals into a useful app.",
        activity: "Build a flashcard trainer.",
      },
    ],
    outcomes: [
      "Write clear Python programs from scratch",
      "Use functions and modules to organize code",
      "Build small automation and learning tools",
    ],
  },
  dsa: {
    title: "Data Structures and Algorithms",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A visual problem-solving track for arrays, stacks, queues, trees, graphs, sorting, and complexity.",
    level: "Intermediate",
    duration: "8 lessons",
    studyNote: "Designed around core CS fundamentals and interview-style reasoning.",
    bestFor: ["Coding interviews", "CS foundations", "Visualization"],
    lessons: [
      {
        title: "Big-O Thinking",
        focus: "Compare time and space complexity across solutions.",
        activity: "Rank three solutions from slowest to fastest.",
      },
      {
        title: "Arrays and Strings",
        focus: "Use indexing, two pointers, sliding windows, and frequency maps.",
        activity: "Visualize a two-pointer search.",
      },
      {
        title: "Stacks and Queues",
        focus: "Model last-in-first-out and first-in-first-out workflows.",
        activity: "Trace a valid parentheses checker.",
      },
      {
        title: "Hash Maps and Sets",
        focus: "Trade memory for faster lookup.",
        activity: "Solve two-sum with a lookup table.",
      },
      {
        title: "Trees",
        focus: "Understand traversal, recursion, and binary search tree rules.",
        activity: "Animate preorder, inorder, and postorder traversal.",
      },
      {
        title: "Graphs",
        focus: "Represent connections and traverse with BFS/DFS.",
        activity: "Find a path through a small graph.",
      },
      {
        title: "Sorting and Searching",
        focus: "Compare sort algorithms and binary search.",
        activity: "Step through merge sort visually.",
      },
      {
        title: "Dynamic Programming",
        focus: "Break repeated subproblems into stored states.",
        activity: "Build a Fibonacci table from the bottom up.",
      },
    ],
    outcomes: [
      "Explain time and space complexity",
      "Select the right data structure for a problem",
      "Trace algorithms visually and verbally",
    ],
  },
  java: {
    title: "Java Development",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A structured Java course covering syntax, object-oriented design, collections, and AP CS-style practice.",
    level: "Beginner to Intermediate",
    duration: "6 lessons",
    studyNote: "Structured around Java fundamentals and AP Computer Science-style reasoning.",
    bestFor: ["AP CS prep", "OOP practice", "Backend foundations"],
    lessons: [
      {
        title: "Java Program Structure",
        focus: "Understand classes, main methods, compilation, and syntax.",
        activity: "Write and run a simple command-line program.",
      },
      {
        title: "Variables and Control Flow",
        focus: "Use types, operators, conditionals, loops, and methods.",
        activity: "Build a grade calculator.",
      },
      {
        title: "Object-Oriented Programming",
        focus: "Create classes, objects, constructors, and methods.",
        activity: "Model a Student class.",
      },
      {
        title: "Inheritance and Polymorphism",
        focus: "Use class hierarchies and method overriding.",
        activity: "Create a simple shape hierarchy.",
      },
      {
        title: "Arrays and ArrayLists",
        focus: "Store, traverse, search, and transform collections.",
        activity: "Analyze quiz scores.",
      },
      {
        title: "Exceptions and Files",
        focus: "Handle runtime issues and read/write basic files.",
        activity: "Load practice questions from a file.",
      },
    ],
    outcomes: [
      "Understand Java's object-oriented model",
      "Solve AP CS-style programming questions",
      "Organize code with reusable classes and methods",
    ],
  },
  js: {
    title: "JavaScript Development",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A practical web development track for JavaScript fundamentals, DOM updates, async code, and browser APIs.",
    level: "Beginner",
    duration: "6 lessons",
    studyNote: "Focused on browser JavaScript and modern frontend foundations.",
    bestFor: ["Frontend learners", "Interactive websites", "React preparation"],
    lessons: [
      {
        title: "JavaScript Basics",
        focus: "Use variables, types, operators, and functions.",
        activity: "Build a simple tip calculator.",
      },
      {
        title: "Objects and Arrays",
        focus: "Represent structured data and transform lists.",
        activity: "Filter a course catalog.",
      },
      {
        title: "DOM and Events",
        focus: "Select elements, update content, and respond to clicks.",
        activity: "Create an interactive flashcard.",
      },
      {
        title: "Async JavaScript",
        focus: "Use promises, fetch, async/await, and JSON.",
        activity: "Load sample questions from an API-like file.",
      },
      {
        title: "Local Storage",
        focus: "Persist settings and progress in the browser.",
        activity: "Save a theme or score.",
      },
      {
        title: "React Readiness",
        focus: "Understand modules, components, state, and props.",
        activity: "Convert a DOM widget into a React component.",
      },
    ],
    outcomes: [
      "Build dynamic browser interactions",
      "Work with API-style data",
      "Prepare for React and modern frontend development",
    ],
  },
  c: {
    title: "C Programming",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A fundamentals-heavy course for memory, pointers, arrays, functions, and low-level programming concepts.",
    level: "Beginner to Intermediate",
    duration: "6 lessons",
    studyNote: "Focused on C fundamentals and systems-style thinking.",
    bestFor: ["Systems basics", "Memory concepts", "CS fundamentals"],
    lessons: [
      {
        title: "C Setup and Syntax",
        focus: "Compile programs and understand the structure of a C file.",
        activity: "Write hello world and inspect compiler errors.",
      },
      {
        title: "Types and Control Flow",
        focus: "Use variables, operators, conditionals, and loops.",
        activity: "Build a unit converter.",
      },
      {
        title: "Functions",
        focus: "Break procedural code into reusable functions.",
        activity: "Refactor a calculator into separate functions.",
      },
      {
        title: "Arrays and Strings",
        focus: "Store sequential data and work with character arrays.",
        activity: "Count vowels in a string.",
      },
      {
        title: "Pointers and Memory",
        focus: "Understand addresses, dereferencing, and memory behavior.",
        activity: "Trace pointer values in a table.",
      },
      {
        title: "Structs and Files",
        focus: "Model records and save/load data.",
        activity: "Store student scores in a file.",
      },
    ],
    outcomes: [
      "Understand how programs interact with memory",
      "Use pointers and arrays confidently",
      "Write efficient procedural C programs",
    ],
  },
  html: {
    title: "HTML & CSS",
    category: "Computer Science",
    image: "/techcourses.png",
    summary:
      "A web foundations course focused on semantic HTML, responsive CSS, layout, forms, and polished page structure.",
    level: "Beginner",
    duration: "6 lessons",
    studyNote: "Focused on web platform fundamentals used in frontend development.",
    bestFor: ["Web beginners", "Portfolio websites", "Frontend foundations"],
    lessons: [
      {
        title: "Semantic HTML",
        focus: "Structure pages with meaningful sections, headings, links, and media.",
        activity: "Mark up a course landing page.",
      },
      {
        title: "Forms and Accessibility",
        focus: "Build usable forms with labels, required fields, and accessible text.",
        activity: "Create a contact form.",
      },
      {
        title: "CSS Foundations",
        focus: "Use selectors, spacing, typography, colors, and reusable classes.",
        activity: "Style a simple lesson card.",
      },
      {
        title: "Flexbox and Grid",
        focus: "Create responsive layouts for cards, navbars, and dashboards.",
        activity: "Build a course catalog grid.",
      },
      {
        title: "Responsive Design",
        focus: "Use media queries and fluid sizing for mobile and desktop.",
        activity: "Make a page work across screen sizes.",
      },
      {
        title: "Portfolio Polish",
        focus: "Improve hierarchy, spacing, contrast, and presentation.",
        activity: "Prepare a project page for recruiters.",
      },
    ],
    outcomes: [
      "Create clean, accessible web pages",
      "Use CSS layout tools confidently",
      "Build responsive pages for mobile and desktop",
    ],
  },
};

export const courseList = Object.entries(courseCatalog).map(([slug, course]) => ({
  slug,
  href: `/${slug}`,
  ...course,
}));

export const satCourses = courseList.filter((course) => course.category === "SAT");
export const computerScienceCourses = courseList.filter((course) => course.category === "Computer Science");
