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
  // disregards the url & data, returns constant response
  mockRequest: (url,data) => mockBoglAPI.mockResponse
};


// API Mocks. These are done to verify that requests complete when provided a request object, and that there aren't bugs present there
it('AJAX Mock test', () => {
  expect(bogl.apiRequestTest(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock share', () => {
  expect(bogl.apiRequestShare(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock load', () => {
  expect(bogl.apiRequestLoad(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock runCode', () => {
  expect(bogl.apiRequestRunCode(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});
