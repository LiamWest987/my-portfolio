/**
 * Sanity Schema Index
 *
 * Import and export all schemas here.
 * Copy this to your Sanity Studio: studio/schemas/index.js
 */

import project from "./project";
import skillCategory from "./skillCategory";
import education from "./education";
import experience from "./experience";
import award from "./award";
import contact from "./contact";

export const schemaTypes = [
  project,
  skillCategory,
  education,
  experience,
  award,
  contact,
];
