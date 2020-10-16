import {Run,SpielServerRequest} from './Run'

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
  expect(SpielServerRequest.test(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock share', () => {
  expect(SpielServerRequest.share(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock load', () => {
  expect(SpielServerRequest.load(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock read', () => {
  expect(SpielServerRequest.read(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});

it('AJAX Mock runCode', () => {
  expect(SpielServerRequest.runCode(mockBoglAPI.mockRequest)).toEqual(mockBoglAPI.mockResponse)
});
