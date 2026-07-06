export type ProgramImportAction =
  | { action: "skip"; reason: "course-already-offered" | "program-already-published" }
  | { action: "import" };

/**
 * Decides whether a program-offering draft should be imported, given:
 * - whether the parent university is already published (its own fields are
 *   never re-written in that case, but new programs can still be added)
 * - whether that university already offers this exact course (by courseId,
 *   not by the draft's guessed slug — so a re-drafted slug can't create a
 *   duplicate offering for a course the university already has)
 * - whether an existing program row matching the draft's slug is published
 *   (the original, unrelated safety net against overwriting a live program)
 */
export function resolveProgramImportAction(input: {
  universityAlreadyPublished: boolean;
  courseAlreadyOfferedByUniversity: boolean;
  existingProgramPublished: boolean;
}): ProgramImportAction {
  if (input.universityAlreadyPublished && input.courseAlreadyOfferedByUniversity) {
    return { action: "skip", reason: "course-already-offered" };
  }

  if (input.existingProgramPublished) {
    return { action: "skip", reason: "program-already-published" };
  }

  return { action: "import" };
}
