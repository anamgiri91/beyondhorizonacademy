insert into public.questions (
  domain,
  topic,
  skill,
  difficulty,
  prompt,
  choices,
  correct_answer,
  explanation,
  solution_steps,
  source_label
) values
(
  'sat_math',
  'Algebra',
  'Linear functions',
  'easy',
  'If f(x) = x + 5 and g(x) = 3x, what is the value of 2f(4) - g(4)?',
  '{"A":"10","B":"6","C":"14","D":"18"}'::jsonb,
  'B',
  'Evaluate each function before combining them. f(4) = 9 and g(4) = 12, so 2(9) - 12 = 6.',
  '["Find f(4): 4 + 5 = 9.", "Find g(4): 3 x 4 = 12.", "Substitute into 2f(4) - g(4): 2(9) - 12.", "Calculate 18 - 12 = 6."]'::jsonb,
  'seed'
),
(
  'sat_math',
  'Advanced Math',
  'Quadratic features',
  'medium',
  'The function h is defined by h(x) = (x - 3)^2 + 11. What is the minimum value of h?',
  '{"A":"20","B":"3","C":"11","D":"8"}'::jsonb,
  'C',
  'The quadratic is in vertex form. Since the squared term cannot be negative, the minimum output is 11.',
  '["Recognize vertex form: (x - h)^2 + k.", "The squared term is smallest when it equals 0.", "That happens at x = 3.", "The minimum value is k = 11."]'::jsonb,
  'seed'
),
(
  'sat_english',
  'Information and Ideas',
  'Command of Evidence (Textual)',
  'easy',
  'A student claims that reminder texts can improve attendance at tutoring sessions. Which evidence would most directly support the claim?',
  '{"A":"Sessions with reminder texts had higher attendance than sessions without reminder texts.","B":"Tutoring sessions were held in three different classrooms after school.","C":"Some students said they liked receiving messages from friends.","D":"The tutoring program covered math, reading, and science topics."}'::jsonb,
  'A',
  'The correct evidence directly compares attendance with and without reminder texts, which matches the claim exactly.',
  '["Identify the claim: reminder texts improve attendance.", "Look for evidence with both variables: reminders and attendance.", "Choice A directly compares attendance between reminder and non-reminder sessions.", "The other choices mention tutoring or messages but do not prove the claim."]'::jsonb,
  'seed'
),
(
  'sat_english',
  'Craft and Structure',
  'Words in Context',
  'medium',
  'The engineer proposed a feasible solution: it required only inexpensive parts already available in the classroom. As used in the text, what does feasible most nearly mean?',
  '{"A":"possible to carry out","B":"carelessly designed","C":"visually impressive","D":"previously rejected"}'::jsonb,
  'A',
  'The colon explains the word. A solution using inexpensive available parts is possible to carry out.',
  '["Read after the colon because it explains the tested word.", "The solution uses available, inexpensive parts.", "That context points to practicality and possibility.", "Feasible therefore means possible to carry out."]'::jsonb,
  'seed'
);
