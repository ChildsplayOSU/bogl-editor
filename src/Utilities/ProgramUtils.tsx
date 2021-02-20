/*
 * ProgramUtils.tsx
 * Created Feb. 20th, 2021
 * Ben Friedman
 *
 * Holds utilities for working on bogl programs
 */

/*
 * extractGameNameFromProgram
 *
 * Takes a string of a concrete bogl program, and extracts the game name (if present),
 * otherwise defaults to 'Program'
 */
const extractGameNameFromProgram = pc => {
  // extract game name, opting for a longer name first, and then a shorter name after
  // if a longer name is not able to be matched
  let gnMatch = pc.match(/game\s+([A-Z][A-Za-z0-9_]+)|([A-Z])/);

  if(gnMatch && gnMatch.length >= 2) {
    return gnMatch[1];
  } else {
    return "Program";
  }
};

export {
  extractGameNameFromProgram
}
