/*
 * BoGLServerRequest.test.js
 * Testing for BoGL server requests
 */

import * as bogl from './BoGLServerRequest'

const mockBoglAPI = {

  // mock response for all endpoints
  mockResponse: {
    tag: "Log",
    contents: "Mock BoGL Passed"
  },
  mockRequest: (url,data) => mockBoglAPI.mockResponse
};


// API Mocks
it('AJAX Mock test', () => {
  expect(bogl.apiRequestTest(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock share', () => {
  expect(bogl.apiRequestShare(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock load', () => {
  expect(bogl.apiRequestLoad(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

/* likely to phase out entirely
it('AJAX Mock read', () => {
  expect(bogl.apiRequestRead(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});
*/

it('AJAX Mock runCode', () => {
  expect(bogl.apiRequestRunCode(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});
