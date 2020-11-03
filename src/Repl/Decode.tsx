/*
 * Decode.tsx
 * Nov. 3rd, 2020
 * Ben Friedman
 *
 * Holds decoding functionality for responses from the server
 */


/*
 * decodeValue
 * Decodes one of the possible values in a response
 *
 * decoded : Decoded response from the server
 */
const decodeValue = (decoded) => {
  // parse by the type of the response
  if(decoded["type"] === "Board") {
    // Board
    return decodeBoard(decoded["value"])

  } else if(decoded["type"] === "Tuple") {
    // Tuple
    return decodeTuple(decoded["value"])

  } else if(decoded["type"] === "Bool") {
    // Bool
    return decodeBool(decoded["value"])

  } else if(decoded["type"] === "Int" || decoded["type"] === "Symbol") {
    // Int || Symbol
    return decoded["value"]

  } else {
    // fallback
    console.error("Unable to decode value for type " + decoded["type"])
    return "Unrecognized Value"

  }
}


/*
* decodeBoard
* Takes a 2D array of JSON values, an encoded board, and
* extracts a TSV representation of the same board to return
*
* board: 2D array of values that represent a BoGL board
*/
const decodeBoard = (board: Array<Array<JSON>>) => {
  // map over every row in the board, and for every space decode the value
  // join elms in rows by tabs, and join rows by line breaks
  // double line break at front to differentiate between repeated boards in tuples
  return "\n\n"+board.map(
    (row) => row.map(
      (space) => decodeValue(space[1])
    ).join("\t")
  ).join("\n");
}


/*
* decodeTuple
* Takes an JS array representing a tuple, which
* can be nested repeatedly
*
* tuple: Array representing an encoded tuple
*/
const decodeTuple = (tuple: any) => {
  // map a decode across all values, and join w/ ','s
  return "(" + tuple.map((e) => decodeValue(e)).join(",") + ")";
}


/*
 * decodeBool
 * Decodes a Bool
 *
 * decoded : Decoded response that contains a bool
 */
const decodeBool = (decoded) => {
  return decoded ? "True" : "False";
}


/*
 * decodeExprType
 * Decodes the type of the given expression
 *
 * latest : JSON obj of the latest expression
 */
const decodeExprType = (typ) => {
  // report this type, if marked with ':t ' from the cmd line
  //let typ = latest["contents"][1]["type"];
  // get first letter in lowercase
  let fl = typ[0].toLowerCase();
  let res = " is";

  if(fl === 'a' || fl === 'e' || fl === 'i' || fl === 'o' || fl === 'u') {
    // vowel sub y, use 'an'
    res += " an ";

  } else {
    // consonant
    res += " a ";

  }
  return res + typ;
}


/*
 * decodeError
 * Decodes an error related to a BoGL API request
 *
 * error :      Obj of error that has occurred
 * respStatus : Status code of the response
 */
const decodeError = (error, respStatus : number) => {

  console.error(error)

  if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError")) && respStatus === 504) {
    // gateway timeout
    return " 🤖 BoGL Says: Unable to finish running your program, or not currently online. Double check your code, or check back later! ";

  } else if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError"))) {
    // bad parse error
    return " 🤖 BoGL Says: I couldn't understand your program. Please double check it and try again! ";

  } else if((error instanceof TypeError || (error.name && error.name === "TypeError")) && respStatus === 0) {
    // likely JS disabled
    return " 🤖 BoGL Says: Unable to execute your program. Make sure that Javascript is enabled and try again! ";

  } else if((error instanceof TypeError || (error.name && error.name === "TypeError"))) {
    // something else?
    return " 🤖 BoGL Says: Unable to execute your program, please double check your code and try again. ";

  } else {
    // general error
    return " 🤖 BoGL Says: An error occurred: " + error + " ";

  }
}


/*
 * decodeReponse
 * Decodes a response from the BoGL API, returned a decoded object
 *
 * reponses: JSON obj containing the responses returned
 */
const decodeResponse = (responses: any) => {
  // get latest response
  const latestResponse = responses[responses.length - 1]

  const category = latestResponse["tag"]
  const contents = latestResponse["contents"]
  let typ = ""
  if(contents[1] !== undefined && contents[1]["type"] !== undefined) {
    typ = contents[1]["type"]
  }

  let value = ""
  if(contents[1] !== undefined && contents[1]["value"] !== undefined) {
    value = contents[1]["value"]
  }

  let boards   = ""
  if(category === "SpielPrompt") {
    if(contents[0] !== undefined && contents[0]["value"] !== undefined) {
      boards = contents.reduce((tot,b) => tot + decodeBoard(b["value"]) + "\n")
    }

  } else {
    // just get the first OR the last board right?
    if(contents[0] !== undefined && contents[0]["value"] !== undefined) {
      contents[0].foreach(b => boards + decodeBoard(b["value"]) + "\n")
    }
  }

  return {
    "category": category,
    "contents": contents,
    "type": typ,
    "value": value,
    "boards": boards
  }
}


export {
  decodeValue,
  decodeBoard,
  decodeTuple,
  decodeBool,
  decodeExprType,
  decodeError,
  decodeResponse
}
