const names = [
  "Amina", "Jonah", "Mira", "Leo", "Sofia", "Noah", "Priya", "Eli", "Nora", "Mateo",
  "Iris", "Caleb", "Zara", "Owen", "Lina", "Kai", "Maya", "Ravi", "Elena", "Theo",
];

const topics = [
  "urban gardens", "solar panels", "library programs", "student podcasts", "coral reefs",
  "public murals", "robotic sensors", "water filters", "bird migration", "online tutoring",
  "community theater", "soil health", "traffic patterns", "museum archives", "language learning",
  "school gardens", "recycling programs", "river cleanup", "weather stations", "music practice",
];

const evidenceData = [
  ["cooler blocks", "blocks with mature trees averaged 4 degrees cooler than blocks without shade"],
  ["stronger memory", "students who explained ideas aloud recalled more details one week later"],
  ["cleaner water", "filters with charcoal removed more particles than filters without charcoal"],
  ["higher attendance", "classes with reminder texts had higher attendance than classes without reminders"],
  ["faster growth", "plants grown in compost-rich soil were taller after six weeks"],
  ["safer crossings", "intersections with raised crosswalks had fewer near misses"],
  ["better focus", "students who silenced notifications completed more tasks"],
  ["lower energy use", "homes with smart thermostats used less electricity in summer"],
  ["more participation", "clubs that offered beginner sessions gained more new members"],
  ["clearer audio", "podcasts recorded in padded rooms had less background noise"],
  ["stronger shells", "oysters in restored reefs developed thicker shells"],
  ["fewer errors", "teams using checklists made fewer labeling mistakes"],
  ["longer battery life", "devices in low-power mode ran for more hours"],
  ["better navigation", "visitors using color-coded signs reached exhibits faster"],
  ["higher germination", "seeds soaked overnight sprouted at a higher rate"],
  ["more accurate forecasts", "stations on rooftops predicted temperature changes more closely"],
  ["less waste", "cafeterias with sorting signs threw away less recyclable material"],
  ["greater confidence", "students who practiced short speeches reported less nervousness"],
  ["faster searches", "databases with tags helped users locate records sooner"],
  ["improved timing", "musicians using metronomes kept a steadier beat"],
];

function stableShift(text, length) {
  let total = 0;

  for (let index = 0; index < text.length; index += 1) {
    total += text.charCodeAt(index) * (index + 1);
  }

  return total % length;
}

function rotateChoices(choices, answer, prompt) {
  const shift = stableShift(prompt, choices.length);
  const rotatedChoices = choices.slice(shift).concat(choices.slice(0, shift));
  const rotatedAnswer = (answer - shift + choices.length) % choices.length;

  return { choices: rotatedChoices, answer: rotatedAnswer };
}

function explainAnswer(skill, correctChoice, baseExplanation) {
  return [
    `Thinking path: First identify what the question is really testing: ${skill}. Do not start by hunting for a choice that sounds familiar; start by naming the job the correct answer must do.`,
    `Why the answer works: ${baseExplanation} The correct choice is "${correctChoice}" because it matches that job directly.`,
    "Why the traps are wrong: The other choices are either too broad, too extreme, only loosely related to the topic, or grammatically/logically mismatched. On the real test, eliminate choices that add claims the text does not prove.",
  ].join(" ");
}

function choiceQuestion(domain, skill, prompt, choices, answer, explanation) {
  const randomized = rotateChoices(choices, answer, prompt);
  const correctChoice = randomized.choices[randomized.answer];

  return {
    domain,
    skill,
    prompt,
    choices: randomized.choices,
    answer: randomized.answer,
    explanation: explainAnswer(skill, correctChoice, explanation),
  };
}


function richQuestion({ style, domain, skill, prompt, choices, answer, whyCorrect, trapNotes, intuition, testTip }) {
  return {
    style,
    domain,
    skill,
    prompt,
    choices,
    answer,
    trapNotes,
    explanation: [
      `Why the answer works: ${whyCorrect}`,
      `What intuition to build: ${intuition}`,
      `Test-day shortcut: ${testTip}`,
    ].join(" "),
    explanationParts: {
      whyCorrect,
      intuition,
      testTip,
    },
  };
}

function buildMixedEnglishPractice() {
  return [
    richQuestion({
      style: "College Board-style",
      domain: "Mixed SAT English Practice",
      skill: "Command of Evidence (Textual)",
      prompt:
        "A student claims that public art can make residents feel more connected to their neighborhood. Which finding would most directly support the claim?",
      choices: [
        "Residents who helped paint a community mural reported speaking with more neighbors afterward.",
        "The mural used blue, yellow, and green paint donated by a local store.",
        "Several cities have rules about where outdoor murals may be installed.",
        "One artist said that large murals are difficult to complete in rainy weather.",
      ],
      answer: 0,
      whyCorrect:
        "The claim is about connection among residents, and this finding directly measures a social result after the public art project.",
      trapNotes: [
        "This is the right evidence because it matches both parts of the claim: public art and neighborhood connection.",
        "This is tempting because it is about the mural, but materials do not show that people felt more connected.",
        "This sounds official and relevant to murals, but rules about installation do not support the social claim.",
        "This gives an artist's opinion about difficulty, not evidence about residents or connection.",
      ],
      intuition:
        "For evidence questions, the correct answer usually mirrors the claim's core nouns and verbs, then adds measurable support.",
      testTip:
        "Underline the claim before reading choices. If a choice does not prove that exact claim, cut it quickly.",
    }),
    richQuestion({
      style: "College Board-style",
      domain: "Mixed SAT English Practice",
      skill: "Command of Evidence (Quantitative)",
      prompt:
        "A table shows that 68% of students using weekly practice sets improved their reading score, while 41% of students using only end-of-unit reviews improved. Which statement best uses the data?",
      choices: [
        "Weekly practice sets were associated with a higher improvement rate than end-of-unit reviews.",
        "Weekly practice sets caused every student to improve their reading score.",
        "End-of-unit reviews helped 27 students improve their score.",
        "Both study methods led to the same rate of improvement.",
      ],
      answer: 0,
      whyCorrect:
        "The statement compares the two percentages accurately: 68% is greater than 41%, so the weekly practice group had the higher improvement rate.",
      trapNotes: [
        "This is correct because it reports the comparison without exaggerating what the data proves.",
        "This overstates the result. The data says 68%, not every student, and it does not prove direct cause.",
        "This confuses percentage points with a number of students; the table gives percentages, not counts.",
        "This contradicts the data because 68% and 41% are not the same.",
      ],
      intuition:
        "Quantitative evidence answers should be boringly precise. Avoid choices that invent cause, counts, or universal claims.",
      testTip:
        "Say the comparison in your own words first: '68 is bigger than 41.' Then choose the answer that says only that.",
    }),
    richQuestion({
      style: "College Board-style",
      domain: "Mixed SAT English Practice",
      skill: "Central Ideas and Details",
      prompt:
        "A passage explains that some schools are replacing long final exams with frequent short quizzes. The passage notes that short quizzes help teachers notice confusion earlier and give students more chances to practice retrieval. Which choice best states the main idea?",
      choices: [
        "Frequent short quizzes can improve learning by revealing confusion early and strengthening recall.",
        "Long final exams are illegal in many school districts.",
        "Students prefer all quizzes to be graded anonymously.",
        "Teachers should stop giving feedback after assessments.",
      ],
      answer: 0,
      whyCorrect:
        "It captures both major points in the passage: early feedback for teachers and retrieval practice for students.",
      trapNotes: [
        "This is correct because it summarizes the whole passage instead of focusing on one stray detail.",
        "This is too extreme and unsupported; the passage compares assessment formats but does not discuss laws.",
        "This introduces a preference that the passage never mentions.",
        "This reverses the passage's logic because the quizzes help teachers respond with feedback sooner.",
      ],
      intuition:
        "Main idea answers must be broad enough to cover the whole text but narrow enough to stay proven by it.",
      testTip:
        "After reading, ask: 'What are all the details examples of?' The answer to that question is usually the main idea.",
    }),
    richQuestion({
      style: "College Board-style",
      domain: "Mixed SAT English Practice",
      skill: "Transitions",
      prompt:
        "The first design for the water filter removed sand from the sample. _____, it failed to remove smaller particles, so the students added a charcoal layer. Which choice completes the text with the most logical transition?",
      choices: ["However", "For example", "Similarly", "Therefore"],
      answer: 0,
      whyCorrect:
        "The second sentence limits the success of the first design: it worked in one way but failed in another. 'However' signals that contrast.",
      trapNotes: [
        "This is correct because the ideas shift from a success to a limitation.",
        "This is tempting because the sentence gives a detail, but it is not an example of the first success.",
        "This suggests similarity, but the second idea contrasts with the first.",
        "This suggests a result, but the failure is not the logical result of removing sand.",
      ],
      intuition:
        "Transition questions are relationship questions. The word is correct only if it names the logic between the sentences.",
      testTip:
        "Cover the choices and label the relationship first: same direction, contrast, cause, example, or conclusion.",
    }),
    richQuestion({
      style: "College Board-style",
      domain: "Mixed SAT English Practice",
      skill: "Boundaries",
      prompt:
        "Which choice completes the text so that it conforms to Standard English? The robotics team tested the sensor indoors _____ the lighting conditions were easier to control.",
      choices: ["because", "; because", ", because", "because,"],
      answer: 0,
      whyCorrect:
        "'Because' correctly introduces a dependent clause that explains why the team tested the sensor indoors; no punctuation is needed before it here.",
      trapNotes: [
        "This is correct because the sentence flows as one complete thought with a reason clause.",
        "A semicolon must connect two independent clauses, but 'because the lighting conditions...' is dependent.",
        "The comma is unnecessary before a reason clause that follows the main clause in this sentence.",
        "The comma after because breaks the phrase and creates awkward punctuation.",
      ],
      intuition:
        "For boundaries, decide whether each side of the blank can stand alone. Punctuation follows structure, not vibes.",
      testTip:
        "If the words after the blank start with a subordinator like because, although, or while, be careful with semicolons.",
    }),
    richQuestion({
      style: "Erica Meltzer-style strategy",
      domain: "Mixed SAT English Practice",
      skill: "Words in Context",
      prompt:
        "The historian's account of the expedition is meticulous, describing not only the route but also the weather, supplies, and daily decisions of the travelers. As used in the text, what does 'meticulous' most nearly mean?",
      choices: ["careful and detailed", "surprisingly brief", "emotionally distant", "publicly controversial"],
      answer: 0,
      whyCorrect:
        "The examples after the comma show that the account includes many precise details, so 'meticulous' means careful and detailed.",
      trapNotes: [
        "This is correct because the surrounding details define the word in context.",
        "This is the opposite of the context; the account includes many details, not very few.",
        "This may describe tone in some passages, but the sentence focuses on amount and precision of detail.",
        "This is unrelated; no public disagreement is mentioned.",
      ],
      intuition:
        "Vocabulary questions are not dictionary quizzes. The sentence usually teaches you the meaning if you read around the word.",
      testTip:
        "Replace the tested word with a simple prediction before looking at choices. Here, predict 'very detailed.'",
    }),
    richQuestion({
      style: "Erica Meltzer-style strategy",
      domain: "Mixed SAT English Practice",
      skill: "Text Structure and Purpose",
      prompt:
        "A passage begins by describing the belief that handwritten notes are always better than typed notes. It then discusses research showing that the effectiveness of either method depends on how actively students process the material. What is the main purpose of the passage?",
      choices: [
        "To complicate a common belief by introducing evidence about learning behavior",
        "To argue that students should never type notes",
        "To provide a chronological history of classroom technology",
        "To compare the prices of notebooks and laptops",
      ],
      answer: 0,
      whyCorrect:
        "The passage moves from a familiar belief to research that makes the issue more nuanced, so its purpose is to complicate that belief.",
      trapNotes: [
        "This is correct because it describes the movement of the whole passage.",
        "This is too absolute and ignores the passage's nuance about active processing.",
        "The passage mentions note-taking methods but does not present a timeline of technology.",
        "This is off-topic; cost is not part of the described structure.",
      ],
      intuition:
        "Structure questions reward tracking the passage's job: introduce, challenge, explain, compare, or qualify.",
      testTip:
        "Use verbs for structure: 'starts with belief, then qualifies it.' Match that verb pattern to the answer.",
    }),
    richQuestion({
      style: "Erica Meltzer-style strategy",
      domain: "Mixed SAT English Practice",
      skill: "Inferences",
      prompt:
        "Researchers found that students who reviewed mistakes within one day of receiving feedback corrected similar errors more often than students who waited a week. The finding suggests that ______",
      choices: [
        "reviewing feedback soon after receiving it can make later practice more effective",
        "students should never attempt difficult questions",
        "all errors disappear if students study for one day",
        "feedback is useful only when it is written by classmates",
      ],
      answer: 0,
      whyCorrect:
        "The finding connects quick review of feedback with improved correction of similar errors, so the safest inference is about timely review improving later practice.",
      trapNotes: [
        "This is correct because it stays close to the evidence and uses cautious language.",
        "This gives advice the study does not support and avoids the point about feedback timing.",
        "This is far too extreme; the finding shows improvement, not perfection.",
        "This invents a condition about classmates that the prompt never mentions.",
      ],
      intuition:
        "Inference answers should feel slightly restrained. If a choice says 'all,' 'never,' or adds new conditions, be suspicious.",
      testTip:
        "Ask what must be true or is strongly suggested, not what could maybe be true in the real world.",
    }),
    richQuestion({
      style: "Erica Meltzer-style strategy",
      domain: "Mixed SAT English Practice",
      skill: "Form, Structure, and Sense",
      prompt:
        "Which choice completes the text so that it conforms to Standard English? The collection of student essays _____ how different writers approach the same theme.",
      choices: ["shows", "show", "showing", "to show"],
      answer: 0,
      whyCorrect:
        "The subject is 'collection,' which is singular, so the singular verb 'shows' agrees with it and completes the sentence.",
      trapNotes: [
        "This is correct because the real subject is singular: collection.",
        "This is tempting because 'essays' is plural, but it is inside a prepositional phrase and is not the subject.",
        "This creates a fragment because the sentence still needs a main verb.",
        "This also fails to provide the needed finite main verb.",
      ],
      intuition:
        "Grammar questions often hide the subject next to a distracting plural noun. Find the real subject before choosing the verb.",
      testTip:
        "Cross out prepositional phrases like 'of student essays' to reveal the subject-verb pair: 'collection shows.'",
    }),
    richQuestion({
      style: "Erica Meltzer-style strategy",
      domain: "Mixed SAT English Practice",
      skill: "Cross-Text Connections",
      prompt:
        "Text 1 argues that online simulations help students test ideas that would be expensive to test in a lab. Text 2 argues that hands-on labs remain important because students learn from handling real equipment. How would the author of Text 2 most likely respond to Text 1?",
      choices: [
        "By acknowledging that simulations are useful while emphasizing a benefit they cannot fully replace",
        "By denying that simulations can model any scientific idea",
        "By agreeing that schools should remove all laboratory equipment",
        "By claiming that cost is the only factor in science education",
      ],
      answer: 0,
      whyCorrect:
        "Text 2 does not reject simulations entirely; it adds that real equipment provides a distinct learning benefit.",
      trapNotes: [
        "This is correct because it captures both texts without making either view extreme.",
        "This is too strong; Text 2 values hands-on labs but does not say simulations are useless.",
        "This contradicts Text 2, which defends real equipment.",
        "This narrows the issue incorrectly; Text 2 focuses on learning from equipment, not only cost.",
      ],
      intuition:
        "Cross-text answers are usually balanced. Respect Text 1's point and Text 2's pushback at the same time.",
      testTip:
        "Write a five-word summary of each text, then choose the response that combines them without exaggeration.",
    }),
    richQuestion({
      style: "Kaplan-style timed practice",
      domain: "Mixed SAT English Practice",
      skill: "Rhetorical Synthesis",
      prompt:
        "While researching student gardens, a student took these notes: The garden is maintained by biology classes. Students measure plant growth weekly. Cafeteria food scraps are composted for the soil. Goal: emphasize how the garden supports science learning. Which choice best uses relevant information?",
      choices: [
        "Biology students use the garden to measure plant growth weekly.",
        "The cafeteria produces food scraps during lunch periods.",
        "Many schools have outdoor spaces near their science classrooms.",
        "Compost can be made from several kinds of organic material.",
      ],
      answer: 0,
      whyCorrect:
        "The goal is science learning, and this choice directly connects biology students with weekly measurement, a science practice.",
      trapNotes: [
        "This is correct because it selects the notes that serve the stated goal.",
        "This uses a note from the list, but it emphasizes cafeteria waste rather than science learning.",
        "This sounds educational but is not one of the provided notes.",
        "This is generally true but does not use the student's notes to meet the goal.",
      ],
      intuition:
        "Rhetorical synthesis is not about using the most facts. It is about choosing the fact that best serves the goal.",
      testTip:
        "Circle the goal phrase and reject any answer whose main point is not that goal.",
    }),
    richQuestion({
      style: "Kaplan-style timed practice",
      domain: "Mixed SAT English Practice",
      skill: "Transitions",
      prompt:
        "The team's first app prototype loaded quickly on new phones. _____, it ran slowly on older devices, so the team simplified the graphics. Which choice completes the text with the most logical transition?",
      choices: ["By contrast", "Additionally", "For instance", "In conclusion"],
      answer: 0,
      whyCorrect:
        "The sentence contrasts performance on new phones with performance on older devices, so 'By contrast' fits.",
      trapNotes: [
        "This is correct because the two device results point in opposite directions.",
        "This signals addition, but the second sentence is not just another similar benefit.",
        "This signals an example, but older-device performance is a contrast, not an example of quick loading.",
        "This signals a final summary, but the sentence introduces a problem and response.",
      ],
      intuition:
        "Timed transition questions should be quick points: identify the direction of the second sentence relative to the first.",
      testTip:
        "Use plus/minus marks: first sentence positive, second negative. Opposite signs mean contrast.",
    }),
    richQuestion({
      style: "Kaplan-style timed practice",
      domain: "Mixed SAT English Practice",
      skill: "Boundaries",
      prompt:
        "Which choice completes the text so that it conforms to Standard English? The debate club met after school _____ members practiced opening statements for the tournament.",
      choices: ["; members", ", members", "members", "; and members"],
      answer: 0,
      whyCorrect:
        "Both sides are independent clauses, so a semicolon can correctly join them without a coordinating conjunction.",
      trapNotes: [
        "This is correct because 'The debate club met after school' and 'members practiced...' can each stand alone.",
        "This creates a comma splice by joining two complete sentences with only a comma.",
        "This runs the clauses together without punctuation.",
        "A semicolon plus 'and' is not the standard way to join these clauses here.",
      ],
      intuition:
        "When both sides are complete sentences, you need a period, semicolon, or comma plus FANBOYS.",
      testTip:
        "Say each side as a sentence. If both work alone, avoid a naked comma.",
    }),
    richQuestion({
      style: "Kaplan-style timed practice",
      domain: "Mixed SAT English Practice",
      skill: "Words in Context",
      prompt:
        "The engineer proposed a feasible solution: it required only inexpensive parts already available in the classroom. As used in the text, what does 'feasible' most nearly mean?",
      choices: ["possible to carry out", "carelessly designed", "visually impressive", "previously rejected"],
      answer: 0,
      whyCorrect:
        "The colon explains why the solution is feasible: it can be done with available, inexpensive parts.",
      trapNotes: [
        "This is correct because the context points to practicality and possibility.",
        "The sentence says the solution uses available parts, not that it was careless.",
        "The solution may or may not look impressive; appearance is not discussed.",
        "Nothing in the sentence says the idea was rejected before.",
      ],
      intuition:
        "On vocabulary questions, punctuation often matters. A colon frequently gives the definition or explanation.",
      testTip:
        "Read after the colon first. It usually tells you what the tested word is doing.",
    }),
    richQuestion({
      style: "Kaplan-style timed practice",
      domain: "Mixed SAT English Practice",
      skill: "Central Ideas and Details",
      prompt:
        "A passage describes how a school podcast lets students interview local scientists, edit audio, and publish episodes for younger students. Which choice best states the central idea?",
      choices: [
        "A school podcast can help students practice communication, technical editing, and science outreach.",
        "Local scientists usually prefer written interviews to recorded conversations.",
        "Audio editing is too difficult for students to learn in school.",
        "Younger students should not listen to science interviews.",
      ],
      answer: 0,
      whyCorrect:
        "It gathers all three details into one broad but accurate summary: communication, editing, and outreach.",
      trapNotes: [
        "This is correct because it accounts for every major detail in the prompt.",
        "This invents a preference that is not stated.",
        "This contradicts the passage, which describes students editing audio.",
        "This introduces a recommendation not supported by the passage.",
      ],
      intuition:
        "Central idea choices often fail by being too narrow, too negative, or completely invented.",
      testTip:
        "Check whether your answer explains why all listed details are included. If not, it is probably too narrow.",
    }),
    richQuestion({
      style: "Original bank remix",
      domain: "Mixed SAT English Practice",
      skill: "Command of Evidence (Textual)",
      prompt:
        "A passage claims that reminder texts can improve attendance at tutoring sessions. Which evidence would most directly support the claim?",
      choices: [
        "Sessions with reminder texts had higher attendance than sessions without reminder texts.",
        "Tutoring sessions were held in three different classrooms after school.",
        "Some students said they liked receiving messages from friends.",
        "The tutoring program covered math, reading, and science topics.",
      ],
      answer: 0,
      whyCorrect:
        "The evidence directly compares attendance with and without reminder texts, which is exactly what the claim is about.",
      trapNotes: [
        "This is correct because it measures the result named in the claim.",
        "This is logistical information, not evidence that reminders improved attendance.",
        "This mentions messages, but not reminder texts or attendance outcomes.",
        "This describes tutoring content, not attendance.",
      ],
      intuition:
        "Strong evidence usually has the same variables as the claim: reminder texts and attendance.",
      testTip:
        "Match variables. If a choice drops one variable, it probably cannot prove the claim.",
    }),
    richQuestion({
      style: "Original bank remix",
      domain: "Mixed SAT English Practice",
      skill: "Inferences",
      prompt:
        "Students who explained algebra mistakes aloud were less likely to repeat those mistakes on the next quiz than students who only reread the correct solutions. This suggests that ______",
      choices: [
        "actively explaining an error can help students recognize and avoid it later",
        "rereading correct solutions always lowers quiz scores",
        "students should explain mistakes only when studying alone",
        "algebra mistakes are impossible to fix without a teacher present",
      ],
      answer: 0,
      whyCorrect:
        "The prompt links explaining mistakes aloud with fewer repeated mistakes, so the answer states that relationship cautiously.",
      trapNotes: [
        "This is correct because it is supported and appropriately limited.",
        "This is too extreme; rereading was less effective here, but the prompt does not say it always hurts scores.",
        "This adds a condition about studying alone that is not in the prompt.",
        "This is unsupported because the prompt does not discuss whether a teacher was present.",
      ],
      intuition:
        "Inference answers should preserve the study's scope: what happened, to whom, and compared with what.",
      testTip:
        "Choose the answer that sounds like a careful researcher wrote it, not an advertisement.",
    }),
    richQuestion({
      style: "Original bank remix",
      domain: "Mixed SAT English Practice",
      skill: "Rhetorical Synthesis",
      prompt:
        "Notes: A student built a low-cost weather station. It records temperature every hour. The data helps the class compare sunny and cloudy days. Goal: emphasize the tool's classroom use. Which choice best accomplishes the goal?",
      choices: [
        "The student's low-cost weather station helps the class compare temperature patterns on sunny and cloudy days.",
        "Weather stations can be built with many different materials.",
        "The student worked on the project during the spring semester.",
        "Temperature is one of several measurements used by meteorologists.",
      ],
      answer: 0,
      whyCorrect:
        "The choice uses the relevant notes and focuses on classroom use: comparing temperature patterns.",
      trapNotes: [
        "This is correct because it follows the goal instead of merely repeating random notes.",
        "This is broadly related but does not emphasize the class's use of the tool.",
        "This may be true, but it does not connect to classroom use.",
        "This is background information, not a synthesis of the notes for the goal.",
      ],
      intuition:
        "The goal controls everything in notes questions. Relevant means useful for that goal, not merely mentioned in the notes.",
      testTip:
        "Before checking choices, write the goal in two words: 'classroom use.' Then pick the answer centered on those words.",
    }),
    richQuestion({
      style: "Original bank remix",
      domain: "Mixed SAT English Practice",
      skill: "Form, Structure, and Sense",
      prompt:
        "Which choice completes the text so that it conforms to Standard English? Neither of the two explanations _____ the graph's most important trend.",
      choices: ["addresses", "address", "addressing", "to address"],
      answer: 0,
      whyCorrect:
        "'Neither' is singular here, so the singular verb 'addresses' agrees with the subject and completes the sentence.",
      trapNotes: [
        "This is correct because 'neither' takes a singular verb in this construction.",
        "This is tempting because 'explanations' is plural, but it is not the grammatical subject.",
        "This creates a fragment because the sentence lacks a finite verb.",
        "This does not complete the sentence as a main verb.",
      ],
      intuition:
        "SAT grammar often places a plural noun near the blank to distract you from a singular subject.",
      testTip:
        "Strip the sentence down: 'Neither addresses the trend.' The answer becomes easier to hear.",
    }),
    richQuestion({
      style: "Original bank remix",
      domain: "Mixed SAT English Practice",
      skill: "Cross-Text Connections",
      prompt:
        "Text 1 argues that student podcasts build confidence because students practice speaking for a real audience. Text 2 argues that podcasts are most useful when students also receive feedback on their scripts. How would the author of Text 2 most likely respond to Text 1?",
      choices: [
        "By agreeing that podcasts can build confidence but adding that feedback improves the learning process",
        "By insisting that students should never speak for real audiences",
        "By claiming that scripts make podcasts impossible to produce",
        "By arguing that confidence is unrelated to communication practice",
      ],
      answer: 0,
      whyCorrect:
        "Text 2 accepts the value of podcasts but adds a condition: feedback on scripts makes them more useful.",
      trapNotes: [
        "This is correct because it is balanced and captures Text 2's qualification.",
        "This contradicts the shared context that podcasts involve audiences.",
        "This invents a problem with scripts; Text 2 says scripts can receive feedback.",
        "This rejects Text 1 too strongly and ignores Text 2's actual point.",
      ],
      intuition:
        "When Text 2 adds a condition, the best answer often says 'yes, but...' rather than 'no.'",
      testTip:
        "Avoid answer choices that turn a mild qualification into a total rejection.",
    }),
  ];
}

function buildCommandTextual() {
  return evidenceData.map(([claim, evidence], index) =>
    choiceQuestion(
      "Information and Ideas",
      "Command of Evidence (Textual)",
      `A passage claims that ${topics[index]} can lead to ${claim}. Which evidence would most directly support the claim?`,
      [
        `A measurement showing that ${evidence}.`,
        `A description of why people first became interested in ${topics[index]}.`,
        `A quote from one person who enjoys learning about ${topics[index]}.`,
        `A list of unrelated materials used in a different project.`,
      ],
      0,
      "The best evidence directly tests or measures the claim rather than merely describing the topic or offering an unrelated detail.",
    ),
  );
}

function buildCommandQuantitative() {
  return names.map((name, index) => {
    const first = 52 + (index % 9) * 4;
    const second = 31 + (index % 7) * 3;
    return choiceQuestion(
      "Information and Ideas",
      "Command of Evidence (Quantitative)",
      `A table shows that ${first}% of students using ${topics[index]} improved their scores, compared with ${second}% of students using only rereading. Which statement best uses the data?`,
      [
        `Students using ${topics[index]} were more likely to improve than students using only rereading.`,
        `Rereading produced better results than ${topics[index]}.`,
        `Exactly ${first - second} students improved in the first group.`,
        "Both groups improved at the same rate.",
      ],
      0,
      `The comparison is between percentages: ${first}% is greater than ${second}%, so the first strategy had the higher improvement rate.`,
    );
  });
}

function buildCentralIdeas() {
  return topics.map((topic, index) =>
    choiceQuestion(
      "Information and Ideas",
      "Central Ideas and Details",
      `A passage explains that ${topic} can support learning by giving students hands-on examples, encouraging collaboration, and connecting classwork to real situations. Which choice best states the main idea?`,
      [
        `${topic[0].toUpperCase() + topic.slice(1)} can make learning more active and connected to real life.`,
        `${topic[0].toUpperCase() + topic.slice(1)} should replace every traditional lesson.`,
        "Students learn only when they work alone.",
        "Classroom examples are less useful than memorized definitions.",
      ],
      0,
      "The main idea should cover the whole passage. The correct choice summarizes the shared point of all three details.",
    ),
  );
}

function buildInferences() {
  return topics.map((topic, index) =>
    choiceQuestion(
      "Information and Ideas",
      "Inferences",
      `Researchers found that students who used ${topic} examples could explain new problems more clearly than students who memorized definitions only. The finding suggests that ______`,
      [
        "memorizing definitions prevents all learning",
        "examples connected to real situations can deepen understanding",
        "students should avoid using examples while studying",
        "new problems are impossible to explain clearly",
      ],
      1,
      "The finding connects real examples with clearer explanations, so the most reasonable inference is that applied examples can deepen understanding.",
    ),
  );
}

const contextWords = [
  ["concise", "brief and clear"], ["novel", "new or unusual"], ["robust", "strong and reliable"],
  ["ambiguous", "unclear"], ["meticulous", "very careful"], ["subtle", "not immediately obvious"],
  ["feasible", "possible to do"], ["prominent", "easy to notice"], ["skeptical", "doubtful"],
  ["adaptable", "able to change"], ["coherent", "logically connected"], ["obsolete", "no longer useful"],
  ["preliminary", "early or initial"], ["substantial", "large or important"], ["consistent", "not changing"],
  ["plausible", "reasonable"], ["efficient", "using little waste"], ["vivid", "clear and lively"],
  ["tentative", "not final"], ["precise", "exact"],
];

function buildWordsInContext() {
  return contextWords.map(([word, meaning], index) =>
    choiceQuestion(
      "Craft and Structure",
      "Words in Context",
      `The team's report was ${word}: readers could understand the main finding after only a few sentences. As used in the sentence, what does "${word}" most nearly mean?`,
      [meaning, "popular with everyone", "hidden from view", "expensive to produce"],
      0,
      `The context after the colon explains the word. Here, "${word}" most nearly means ${meaning}.`,
    ),
  );
}

function buildTextStructure() {
  return topics.map((topic) =>
    choiceQuestion(
      "Craft and Structure",
      "Text Structure and Purpose",
      `A passage first describes a common assumption about ${topic}, then presents research that challenges that assumption. What is the main purpose of the passage?`,
      [
        "To list several unrelated facts",
        "To contrast a belief with evidence that complicates it",
        "To explain why research should be ignored",
        "To advertise a product without evidence",
      ],
      1,
      "The passage structure moves from an assumption to evidence against or beyond it, so the purpose is contrast and complication.",
    ),
  );
}

function buildCrossText() {
  return topics.map((topic) =>
    choiceQuestion(
      "Craft and Structure",
      "Cross-Text Connections",
      `Text 1 argues that ${topic} gives students flexible practice. Text 2 argues that teacher feedback is still necessary because students may not notice their own mistakes. How would the author of Text 2 most likely respond to Text 1?`,
      [
        "By agreeing that practice can help but emphasizing that feedback remains important",
        "By claiming that students never benefit from practice",
        "By arguing that teachers should avoid giving feedback",
        "By saying that flexible practice and feedback are identical",
      ],
      0,
      "Text 2 does not reject practice completely; it adds that feedback is necessary, so the balanced response is best.",
    ),
  );
}

const transitions = [
  ["contrast", "However"], ["result", "Therefore"], ["example", "For example"], ["addition", "Moreover"],
  ["similarity", "Similarly"], ["concession", "Even so"], ["sequence", "Next"], ["emphasis", "Indeed"],
  ["cause", "Because of this"], ["clarification", "In other words"], ["alternative", "Instead"],
  ["summary", "Overall"], ["condition", "If so"], ["comparison", "Likewise"], ["specific case", "In particular"],
  ["unexpected result", "Nevertheless"], ["support", "For this reason"], ["continuation", "Additionally"],
  ["contrast", "By contrast"], ["conclusion", "Thus"],
];

function buildTransitions() {
  return transitions.map(([relationship, answer], index) =>
    choiceQuestion(
      "Expression of Ideas",
      "Transitions",
      `The first trial of the ${topics[index]} project produced mixed results. _____, the revised trial showed clear improvement. Which transition best completes the text?`,
      [answer, "For instance", "Similarly", "Beforehand"].sort((a, b) => (a === answer ? -1 : b === answer ? 1 : 0)),
      0,
      `The ideas have a ${relationship} relationship, so "${answer}" creates the clearest logical connection.`,
    ),
  );
}

function buildRhetoricalSynthesis() {
  return topics.map((topic, index) =>
    choiceQuestion(
      "Expression of Ideas",
      "Rhetorical Synthesis",
      `Notes: ${names[index]} studied ${topic}. The project used a low-cost tool. The tool helped students collect data quickly. Goal: emphasize the project's practical benefit. Which choice best accomplishes the goal?`,
      [
        `${names[index]}'s low-cost ${topic} tool helped students collect data quickly.`,
        `${names[index]} is one of many students interested in research.`,
        `${topic[0].toUpperCase() + topic.slice(1)} can be discussed in many classes.`,
        "Data collection is a common part of school assignments.",
      ],
      0,
      "The goal asks for practical benefit, so the correct choice connects the low-cost tool to a useful result.",
    ),
  );
}

function buildBoundaries() {
  return topics.map((topic, index) =>
    choiceQuestion(
      "Standard English Conventions",
      "Boundaries",
      `Which choice completes the sentence correctly? The students revised the ${topic} project _____ they could present their results clearly.`,
      ["project, so", "project so", "project; so that", "project, and so that"],
      0,
      "A comma plus 'so' correctly links the complete idea to the result that follows.",
    ),
  );
}

const verbs = [
  ["Each module", "includes"], ["The list of strategies", "is"], ["Neither explanation", "addresses"],
  ["The notes", "show"], ["A group of students", "uses"], ["The results", "suggest"],
  ["Every graph", "contains"], ["The researchers", "compare"], ["One of the passages", "mentions"],
  ["Several examples", "support"], ["The final sentence", "clarifies"], ["Both choices", "refer"],
  ["The experiment", "requires"], ["Many students", "prefer"], ["This set of questions", "measures"],
  ["The author", "emphasizes"], ["The two texts", "differ"], ["A collection of notes", "provides"],
  ["The table", "summarizes"], ["These details", "indicate"],
];

function buildFormStructureSense() {
  return verbs.map(([subject, verb]) =>
    choiceQuestion(
      "Standard English Conventions",
      "Form, Structure, and Sense",
      `${subject} _____ a clear clue about the correct answer.`,
      [verb, verb.endsWith("s") ? verb.slice(0, -1) : `${verb}s`, "including", "to include"],
      0,
      "The verb must agree with the subject and fit the sentence logically.",
    ),
  );
}

const rawEnglishPracticeModules = [
  {
    domain: "Mixed SAT English Practice",
    description:
      "A curated 20-question set that blends official-test style, strategy-driven reading, timed-practice pacing, and original Beyond Horizon question patterns. The goal is not memorization; it is building the judgment students need when answers are close.",
    realTestTips: [
      "Predict the job of the answer before reading the choices.",
      "Eliminate choices that are true-sounding but do not answer the exact question.",
      "Use cautious language for inference and evidence questions.",
      "For grammar, identify the sentence structure before listening for what sounds right.",
    ],
    questionTypes: [
      {
        type: "Mixed 20-Question Set",
        description:
          "Five College Board-style questions, five strategy-focused questions, five timed-practice questions, and five original bank remixes with deeper explanations.",
        tips: [
          "Read for the task, not just the topic.",
          "After answering, study why the trap choices were tempting.",
          "Build a repeatable shortcut for each question type.",
        ],
        questions: buildMixedEnglishPractice(),
      },
    ],
  },
  {
    domain: "Information and Ideas",
    description:
      "These questions test whether you can understand a short text, identify the exact claim being made, connect evidence to that claim, and use data from tables or graphs without overreaching.",
    realTestTips: [
      "Read the question before judging the answer choices.",
      "For evidence questions, match the answer to the exact claim, not just the general topic.",
      "For quantitative questions, compare the numbers carefully and avoid choices that add claims the data does not prove.",
      "For inference questions, choose the safest conclusion supported by the text.",
    ],
    questionTypes: [
      {
        type: "Command of Evidence (Textual)",
        description:
          "You will see a claim and choose the evidence that most strongly supports it.",
        tips: ["Find the claim's key idea.", "Reject evidence that is merely related but not direct."],
        questions: buildCommandTextual(),
      },
      {
        type: "Command of Evidence (Quantitative)",
        description:
          "You will use data from a table or graph to complete or support a statement.",
        tips: ["Check units and percentages.", "Do not infer cause unless the data supports cause."],
        questions: buildCommandQuantitative(),
      },
      {
        type: "Central Ideas and Details",
        description:
          "You will identify the main idea or answer a specific detail question from the passage.",
        tips: ["Pick the answer that covers the whole text.", "Avoid choices that are too narrow or too extreme."],
        questions: buildCentralIdeas(),
      },
      {
        type: "Inferences",
        description:
          "You will complete the passage with the choice most logically supported by the information given.",
        tips: ["Stay close to the evidence.", "The correct answer usually sounds cautious, not exaggerated."],
        questions: buildInferences(),
      },
    ],
  },
  {
    domain: "Craft and Structure",
    description:
      "These questions test vocabulary in context, rhetorical purpose, structure, and relationships between paired texts.",
    realTestTips: [
      "Use nearby context before relying on a memorized definition.",
      "For purpose questions, ask why the author included the sentence or paragraph.",
      "For paired texts, name each author's view before checking choices.",
    ],
    questionTypes: [
      {
        type: "Words in Context",
        description:
          "You will choose the most precise meaning of a word or phrase in context.",
        tips: ["Replace the word with your own simple word first.", "Use tone and surrounding logic."],
        questions: buildWordsInContext(),
      },
      {
        type: "Text Structure and Purpose",
        description:
          "You will identify why a passage is organized a certain way or what a part of the text does.",
        tips: ["Track the movement of the text.", "Look for contrast, example, problem-solution, or explanation."],
        questions: buildTextStructure(),
      },
      {
        type: "Cross-Text Connections",
        description:
          "You will compare two short texts and decide how one author would respond to the other.",
        tips: ["Summarize Text 1 and Text 2 separately.", "Choose the answer that respects both views."],
        questions: buildCrossText(),
      },
    ],
  },
  {
    domain: "Expression of Ideas",
    description:
      "These questions ask you to revise writing so ideas connect clearly and meet a specific rhetorical goal.",
    realTestTips: [
      "For transitions, identify the relationship before reading the choices.",
      "For notes questions, use only details that match the goal.",
      "Do not choose an answer just because it includes many facts.",
    ],
    questionTypes: [
      {
        type: "Transitions",
        description:
          "You will select the transition that best connects ideas within a passage.",
        tips: ["Label the relationship: contrast, cause, example, addition, or conclusion.", "Plug the transition back into the sentence."],
        questions: buildTransitions(),
      },
      {
        type: "Rhetorical Synthesis",
        description:
          "You will use relevant notes to achieve a specific writing goal.",
        tips: ["Read the goal twice.", "Ignore notes that do not serve the goal."],
        questions: buildRhetoricalSynthesis(),
      },
    ],
  },
  {
    domain: "Standard English Conventions",
    description:
      "These questions test sentence boundaries, punctuation, grammar, usage, and whether words fit the structure of the sentence.",
    realTestTips: [
      "Find the subject and verb before choosing.",
      "For punctuation, decide whether each side of the blank is a complete sentence.",
      "Shorter is often better, but only if grammar and meaning stay correct.",
    ],
    questionTypes: [
      {
        type: "Boundaries",
        description:
          "You will choose punctuation or linking words that correctly connect phrases, clauses, and sentences.",
        tips: ["Check whether each side can stand alone.", "Avoid comma splices."],
        questions: buildBoundaries(),
      },
      {
        type: "Form, Structure, and Sense",
        description:
          "You will choose the word form or grammatical structure that fits the sentence.",
        tips: ["Check subject-verb agreement.", "Make sure the selected word fits the meaning of the sentence."],
        questions: buildFormStructureSense(),
      },
    ],
  },
];

function rotateList(list, shift) {
  return Array.isArray(list) ? list.slice(shift).concat(list.slice(0, shift)) : list;
}

function moveAnswerToIndex(question, targetAnswer) {
  const shift = (question.answer - targetAnswer + question.choices.length) % question.choices.length;

  return {
    ...question,
    choices: rotateList(question.choices, shift),
    trapNotes: rotateList(question.trapNotes, shift),
    answer: targetAnswer,
  };
}

export const englishPracticeModules = rawEnglishPracticeModules.map((module) => ({
  ...module,
  questionTypes: module.questionTypes.map((questionType) => ({
    ...questionType,
    questions: questionType.questions.map((question, index) => moveAnswerToIndex(question, index % 4)),
  })),
}));
