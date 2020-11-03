/*
 * BoGLServerRequest.test.js
 * Testing for BoGL server requests
 */

import * as d from './Decode'

it('Test decode Ints', () => {
  expect(d.decodeValue({
    type: "Int",
    value: 123
  })).toEqual(123)

  expect(d.decodeValue({
    type: "Int",
    value: -23534543
  })).toEqual(-23534543)

  expect(d.decodeValue({
    type: "Int",
    value: 0
  })).toEqual(0)

  expect(d.decodeValue({
    type: "Int",
    value: 987653423
  })).toEqual(987653423)
});


it('Test decode Bools', () => {
  expect(d.decodeValue({
    type: "Bool",
    value: true
  })).toEqual("True")

  expect(d.decodeValue({
    type: "Bool",
    value: false
  })).toEqual("False")

  // any other val will be coerced to a bool...
  expect(d.decodeValue({
    type: "Bool",
    value: 123
  })).toEqual("True")
});


it('Test decode Symbols', () => {
  expect(d.decodeValue({
    type: "Symbol",
    value: "A"
  })).toEqual("A")

  expect(d.decodeValue({
    type: "Symbol",
    value: "A"
  })).toEqual("A")

  expect(d.decodeValue({
    type: "Symbol",
    value: "Q_eQ"
  })).toEqual("Q_eQ")
});


it('Test decode Tuples', () => {
  expect(d.decodeValue({
    type: "Tuple",
    value: [
      {
        type: "Int",
        value: 0
      },
      {
        type: "Int",
        value: 0
      }
    ]
  })).toEqual("(0,0)")

  expect(d.decodeValue({
    type: "Tuple",
    value: [
      {
        type: "Int",
        value: 23238
      },
      {
        type: "Bool",
        value: true
      }
    ]
  })).toEqual("(23238,True)")

  expect(d.decodeValue({
    type: "Tuple",
    value: [
      {
        type: "Bool",
        value: false
      },
      {
        type: "Int",
        value: -9000
      },
      {
        type: "Symbol",
        value: "Apple"
      }
    ]
  })).toEqual("(False,-9000,Apple)")
});

it('Test decode nested Tuples', () => {
  expect(d.decodeValue({
    type: "Tuple",
    value: [
      {
        type: "Bool",
        value: false
      },
      {
        type: "Tuple",
        value: [
          {
            type: "Int",
            value: 0
          },
          {
            type: "Tuple",
            value: [
              {
                type: "Bool",
                value: false
              },
              {
                type: "Bool",
                value: true
              }
            ]
          }
        ]
      },
      {
        type: "Symbol",
        value: "Apple"
      }
    ]
  })).toEqual("(False,(0,(False,True)),Apple)")
});

it('Test decode Boards', () => {
  expect(d.decodeValue({
    type: "Board",
    value: [
      [
        [
          [1,1],
          {"value":5,"type":"Int"}
        ],
        [
          [2,1],
          {"value":5,"type":"Int"}
        ],
        [
          [3,1],
          {"value":5,"type":"Int"}
        ]
      ],
      [
        [
          [1,2],
          {"value":5,"type":"Int"}
        ],
        [
          [2,2],
          {"value":5,"type":"Int"}
        ],
        [
          [3,2],
          {"value":5,"type":"Int"}
        ]
      ],
      [
        [
          [1,3],
          {"value":5,"type":"Int"}
        ],
        [
          [2,3],
          {"value":5,"type":"Int"}
        ],
        [
          [3,3],
          {"value":5,"type":"Int"}
        ]
      ]
    ]
  })).toEqual("\n\n5\t5\t5\n5\t5\t5\n5\t5\t5")
});


it('Test decode Board in Tuple', () => {
  let val = d.decodeValue({
    type: "Tuple",
    value: [
      {
        type: "Bool",
        value: false
      },
      {
        type: "Board",
        value: [
          [
            [
              [1,1],
              {"value":5,"type":"Int"}
            ],
            [
              [2,1],
              {"value":5,"type":"Int"}
            ],
            [
              [3,1],
              {"value":5,"type":"Int"}
            ]
          ],
          [
            [
              [1,2],
              {"value":5,"type":"Int"}
            ],
            [
              [2,2],
              {"value":5,"type":"Int"}
            ],
            [
              [3,2],
              {"value":5,"type":"Int"}
            ]
          ],
          [
            [
              [1,3],
              {"value":5,"type":"Int"}
            ],
            [
              [2,3],
              {"value":5,"type":"Int"}
            ],
            [
              [3,3],
              {"value":5,"type":"Int"}
            ]
          ]
        ]
      }
    ]
  });
  let expected = "(False,\n\n5\t5\t5\n5\t5\t5\n5\t5\t5)";
  expect(val).toEqual(expected)
});

it('Test Decode Expr Types', () => {
  expect(d.decodeExprType("Apple")).toEqual(" is an Apple")
  expect(d.decodeExprType("X")).toEqual(" is a X")
  expect(d.decodeExprType("Can")).toEqual(" is a Can")
  expect(d.decodeExprType("Y")).toEqual(" is a Y")
});
