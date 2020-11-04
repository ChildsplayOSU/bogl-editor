/*
 * Repl.test.js
 * Testing for the Repl
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Repl } from './Repl'
import { act } from 'react-dom/test-utils'; // ES6
import * as Err from './Errors'

const getReplResponse = (e,r,callback) => {
  const qq = <Repl testingHook={{
    "expr": e,
    "print": callback,
    "responses": r
  }}/>
  ReactDOM.render(qq, document.createElement('div'));
}

// Test verifies inputting 5, and getting the expected response, should parse back to '5' correctly
it('Verify 5 returns', () => {
  getReplResponse("5", [
    {"tag":"SpielTypes","contents": [] },
    {"tag":"SpielValue","contents": [
      [],
      {"value":5,"type":"Int"}
    ]
  }], (resp) => {
    expect(resp).toEqual("5")
  })
});


it('Verify :t prompts Int type', () => {
  getReplResponse(":t 5", [
    {"tag":"SpielTypes","contents": [] },
    {"tag":"SpielValue","contents": [
      [],
      {"value":5,"type":"Int"}
    ]
  }], (resp) => {
    expect(resp).toEqual("5 is an Int")
  })
});


it('Verify :t prompts Bool type', () => {
  getReplResponse(":t 5", [
    {"tag":"SpielTypes","contents": [] },
    {"tag":"SpielValue","contents": [
      [],
      {"value":false,"type":"Bool"}
    ]
  }], (resp) => {
    expect(resp).toEqual("False is a Bool")
  })
});


it('Verify parse error for Bool', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielParseError","contents":[1,5,"game Test","(line 1, column 5):\nunexpected reserved word \"Bool\"\nexpecting expression"]}], (resp) => {
    expect(resp).toEqual("Language Error: (line 1, column 5):\nunexpected reserved word \"Bool\"\nexpecting expression")
  })
});


it('Verify False', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":false,"type":"Bool"}]}], (resp) => {
    expect(resp).toEqual("False")
  })
});


it('Verify True', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":true,"type":"Bool"}]}], (resp) => {
    expect(resp).toEqual("True")
  })
});


it('Verify Bad Bool', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":123,"type":"Bool"}]}], (resp) => {
    expect(resp).toEqual(" 🤖 BoGL Says: An error occurred: ReferenceError: Attempted to decode non boolean value of 123 ")
  })
});


it('Verify unknown ref is undefined', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielTypeError","contents":{"line":1,"col":1,"message":"Type error in the interpreter input (line 1, column 1)\nYou did not define unknown"}}], (resp) => {
    expect(resp).toEqual("Type error in the interpreter input (line 1, column 1)\nYou did not define unknown")
  })
});


it('Verify 2-tuple', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":[{"value":1,"type":"Int"},{"value":1,"type":"Int"}],"type":"Tuple"}]}], (resp) => {
    expect(resp).toEqual("(1,1)")
  })
});


it('Verify heterogeneous 3-tuple', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":[{"value":1,"type":"Int"},{"value":true,"type":"Bool"},{"value":"Apple","type":"Symbol"}],"type":"Tuple"}]}], (resp) => {
    expect(resp).toEqual("(1,True,Apple)")
  })
});


it('Verify nested tuples', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[]},{"tag":"SpielValue","contents":[[],{"value":[{"value":1,"type":"Int"},{"value":[{"value":2,"type":"Int"},{"value":[{"value":3,"type":"Int"},{"value":"OK","type":"Symbol"}],"type":"Tuple"}],"type":"Tuple"}],"type":"Tuple"}]}], (resp) => {
    expect(resp).toEqual("(1,(2,(3,OK)))")
  })
});


it('Verify 2x2 Board', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[["b",{"tag":"Plain","contents":{"tag":"X","contents":["Board",[]]}}]]},{"tag":"SpielValue","contents":[[],{"value":[[[[1,1],{"value":9,"type":"Int"}],[[2,1],{"value":9,"type":"Int"}]],[[[1,2],{"value":9,"type":"Int"}],[[2,2],{"value":9,"type":"Int"}]]],"type":"Board"}]}], (resp) => {
    expect(resp).toEqual("\n\n9\t9\n9\t9")
  });
});


it('Verify tuple with board', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[["b",{"tag":"Plain","contents":{"tag":"X","contents":["Board",[]]}}]]},{"tag":"SpielValue","contents":[[],{"value":[{"value":1,"type":"Int"},{"value":[[[[1,1],{"value":9,"type":"Int"}],[[2,1],{"value":9,"type":"Int"}]],[[[1,2],{"value":9,"type":"Int"}],[[2,2],{"value":9,"type":"Int"}]]],"type":"Board"}],"type":"Tuple"}]}], (resp) => {
    expect(resp).toEqual("(1,\n\n9\t9\n9\t9)")
  });
});


it('Verify language error', () => {
  getReplResponse(".",[{"tag":"SpielTypes","contents":[["b",{"tag":"Plain","contents":{"tag":"X","contents":["Board",[]]}}]]},{"tag":"SpielParseError","contents":[1,17,"game Test\n\ntype Board = Array (2,2) of Int\n\nb : Board\nb!(x,y) = 9","(line 1, column 17):\nunexpected end of input\nexpecting end of \"in\" or expression"]}], (resp) => {
    expect(resp).toEqual("Language Error: (line 1, column 17):\nunexpected end of input\nexpecting end of \"in\" or expression")
  });
});


it('Verify type error', () => {
  getReplResponse(".",[{},{"tag":"SpielTypeError","contents":{"line":1,"col":5,"message":"Type error in the interpreter input (line 1, column 5)\nCould not match types Int and Bool in expression:\n\t5 + True"}}], (resp) => {
    expect(resp).toEqual("Type error in the interpreter input (line 1, column 5)\nCould not match types Int and Bool in expression:\n\t5 + True")
  });
});


it('Verify runtime error', () => {
  getReplResponse(".",[{},{"tag":"SpielRuntimeError","contents":"\"Your expression took too long to evaluate and was stopped! Please double check your program and try again.\""}], (resp) => {
    expect(resp).toEqual("Runtime Error: \"Your expression took too long to evaluate and was stopped! Please double check your program and try again.\"")
  });
});



/*
let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

//TODO updating state causes problems with react
// This is a WIP, tried playing around with various approaches, but react is very stingy
// about when state is updated from tests
it('Verify input prompt', () => {
  ...
});
*/

/*
// TODO does not work with the current setup, needs another approach, otherwise causes infinite re-renders and kills the tests
it('Verify clear prompt', () => {
  getReplResponse("clear",[{},{"tag":"SpielValue","contents":[[],{"value":false,"type":"Bool"}]}], (resp) => {
    expect(resp).toEqual(" 🤖 BoGL Says: Ok, exiting Input Mode. ")
  });
});
*/


it('Verify bad parse', () => {
  getReplResponse(".","Bad Response", (resp) => {
    expect(resp).toEqual(Err.BoglTypeError)
  });
});


it('Print all placed boards before final expr result', () => {
  getReplResponse("let x = p in input",[{},{"tag":"SpielValue","contents":[[{"value":[[[[1,1],{"value":2,"type":"Int"}],[[2,1],{"value":0,"type":"Int"}],[[3,1],{"value":0,"type":"Int"}]],[[[1,2],{"value":0,"type":"Int"}],[[2,2],{"value":0,"type":"Int"}],[[3,2],{"value":0,"type":"Int"}]],[[[1,3],{"value":0,"type":"Int"}],[[2,3],{"value":0,"type":"Int"}],[[3,3],{"value":0,"type":"Int"}]]],"type":"Board"},{"value":[[[[1,1],{"value":1,"type":"Int"}],[[2,1],{"value":1,"type":"Int"}],[[3,1],{"value":1,"type":"Int"}]],[[[1,2],{"value":1,"type":"Int"}],[[2,2],{"value":1,"type":"Int"}],[[3,2],{"value":1,"type":"Int"}]],[[[1,3],{"value":1,"type":"Int"}],[[2,3],{"value":1,"type":"Int"}],[[3,3],{"value":1,"type":"Int"}]]],"type":"Board"}],{"value":1,"type":"Int"}]}], (resp) => {
    expect(resp).toEqual("\n\n2\t0\t0\n0\t0\t0\n0\t0\t0\n\n1\t1\t1\n1\t1\t1\n1\t1\t1\n\n1")
  });
});


// an example of a legitimate space invaders runtime error
// includes all the types for size
it('Space Invaders Runtime Error with All Types', () => {
  getReplResponse("let x = p in input",[{"tag":"SpielTypes","contents":[["play",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]},{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]}]}],["playSpaceInvader",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]},{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]}]}],["determineWinner",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]},{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]}]}],["getInput",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]},{"tag":"X","contents":["Top",["A","B","D","S","W"]]}]}],["switchPlayer",{"tag":"Function","contents":[{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]},{"tag":"X","contents":["Top",["Player1Name","Player2Name"]]}]}],["moveUFO",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["A","B","D","S","W"]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]}]}],["moveShip",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Top",["A","B","D","S","W"]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]}]}],["updateBombs",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Board",[]]}]}],["getBoard",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Board",[]]}]}],["updatePosition",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"X","contents":["Top",["A","B","D","S","W"]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]}],["getUFOPosition",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]}],["getShipPosition",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]}],["getRow",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"X","contents":["Itype",[]]}]}],["getCol",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"X","contents":["Itype",[]]}]}],["empty",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Board",[]]}]}],["spaceInvaderBoard",{"tag":"Function","contents":[{"tag":"Tup","contents":[{"tag":"X","contents":["Board",[]]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]},{"tag":"Tup","contents":[{"tag":"X","contents":["Itype",[]]},{"tag":"X","contents":["Itype",[]]}]}]},{"tag":"X","contents":["Board",[]]}]}],["initialBoard",{"tag":"Plain","contents":{"tag":"X","contents":["Board",[]]}}],["open",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["M","O","U","X"]]}}],["ufo",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["M","O","U","X"]]}}],["bomb",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["M","O","U","X"]]}}],["ship",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["M","O","U","X"]]}}],["dropBomb",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["A","B","D","S","W"]]}}],["down",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["A","B","D","S","W"]]}}],["right",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["A","B","D","S","W"]]}}],["left",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["A","B","D","S","W"]]}}],["up",{"tag":"Plain","contents":{"tag":"X","contents":["Top",["A","B","D","S","W"]]}}],["maxRow",{"tag":"Plain","contents":{"tag":"X","contents":["Itype",[]]}}],["maxCol",{"tag":"Plain","contents":{"tag":"X","contents":["Itype",[]]}}]]},{"tag":"SpielRuntimeError","contents":"\"Your expression took too long to evaluate and was stopped! Please double check your program and try again.\""}], (resp) => {
    expect(resp).toEqual("Runtime Error: \"Your expression took too long to evaluate and was stopped! Please double check your program and try again.\"")
  });
});
