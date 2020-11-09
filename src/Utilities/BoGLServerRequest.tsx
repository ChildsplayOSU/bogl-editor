/*
 * BoGLServerRequest.tsx
 * Created Nov. 3rd, 2020
 * Ben Friedman
 *
 * Holds functionality for interacting w/ the BoGL API
 */

// Current API for BOGL, proxied by NGINX on the server
const BOGL_API = "/api_1";

// Standard POST request headers for the BoGL language server
const postHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

/*
 * apiRequestTest
 * Requests from the /test endpoint, used to verify BoGL is running
 *
 * request: The function to make the request with
 */
const apiRequestTest = (request) => {
  return request(BOGL_API+'/test', {method: 'GET'});
}

/*
 * apiRequestShare
 * Requests the /share endpoint to save a file, and return a sharable link to
 * that program and it's prelude
 *
 * request:  The function to make the request with
 * prelude:  Content of the prelude to share
 * prog:     Content of the program to share
 */
const apiRequestShare = (request, prelude, prog) => {
  return request(BOGL_API+'/share', {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify({
          preludeContent: prelude,
          gameContent: prog
      })
  });
}

/*
 * apiRequestLoad
 * Requests the /load endpoint with a unique id. Use to fetch
 * the contents of a shared file & prelude that someobody else wrote
 *
 * request: The function to make the request with
 * id:      Unique ID of the prelude & prog to return
 */
const apiRequestLoad = (request, id) => {
  return request(BOGL_API+'/load', {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify({
          fileName: id
      })
  });
}

/*
 * apiRequestRunCode
 * Requests the /runCode endpoint to send a prelude, program, an
 * expression to evaluate, and a buffer of inputs for input mode
 *
 * request:     The function to make the request with
 * prelude:     Content of the prelude to run (string)
 * prog:        Content of the program to run (string)
 * expr:        Expression to evaluate in the context of the code & prelude (string)
 * inputBuffer: Array of strings to send as input ([string])
 */
const apiRequestRunCode = (request, prelude, prog, expr, inputBuffer) => {
  return request(BOGL_API+'/runCode', {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify({
          prelude: prelude, // prelude contents
          file: prog,       // program contents
          input: expr,      // expr to evaluate in the context of prelude & prog
          buffer: inputBuffer,  // input buffer to utilize for 'input' refs
          programName: "Program"
      }),
  })
}

export {
  apiRequestTest,
  apiRequestShare,
  apiRequestLoad,
  apiRequestRunCode
}
