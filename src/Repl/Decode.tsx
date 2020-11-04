/*
 * Decode.tsx
 * Nov. 3rd, 2020
 * Ben Friedman
 *
 * Holds decoding functionality for responses from the server
 */

import * as Err from './Errors'

/*
 * decodeValue
 * Decodes one of the possible values in a response
 *
 * decoded : Decoded response from the server
 */
const decodeValue = (decoded: Array<any>) => {

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
    //console.error("Unable to decode value for type " + decoded["type"])
    throw ReferenceError("Unrecognized Value of type " + decoded["type"])

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
const decodeBool = (decoded: boolean) => {
  if(typeof decoded === "boolean") {
    return decoded ? "True" : "False";

  } else {
    throw ReferenceError("Attempted to decode non boolean value of " + decoded);

  }
}


/*
 * decodeExprType
 * Decodes the type of the given expression
 *
 * latest : JSON obj of the latest expression
 */
const decodeExprType = (typ) => {
  // report this type, if marked with ':t ' from the cmd line
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
  if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError")) && respStatus === 504) {
    // gateway timeout
    return Err.BoglGateWayTimeoutError;

  } else if((error instanceof SyntaxError || (error.name && error.name === "SyntaxError"))) {
    // bad parse error
    return Err.BoglResponseParseError;

  } else if((error instanceof TypeError || (error.name && error.name === "TypeError")) && respStatus === 0) {
    // likely JS disabled
    return Err.BoglNoJSError;

  } else if((error instanceof TypeError || (error.name && error.name === "TypeError"))) {
    // something else?
    return Err.BoglTypeError;

  } else {
    // general error
    //console.dir(error)
    return " 🤖 BoGL Says: An error occurred: " + error + " ";

  }
}


export {
  decodeValue,
  decodeBoard,
  decodeTuple,
  decodeBool,
  decodeExprType,
  decodeError
}
