import {
  describe, test, expect, beforeEach, vi, MockInstance,
} from 'vitest';
import { addTypo } from './addTypo';

describe('addTypo', () => {
  let mathRandomSpy: MockInstance;

  beforeEach(() => {
    // Reset Math.random mock before each test
    if (mathRandomSpy) {
      mathRandomSpy.mockRestore();
    }
  });

  test('handles single character string', () => {
    mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0); // Force TRANSPOSITION
    expect(addTypo('a')).toBe('a');
  });

  test('performs TRANSPOSITION typo', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // Select TRANSPOSITION type
      .mockReturnValueOnce(0); // Select first character
    expect(addTypo('hello')).toBe('ehllo');
  });

  test('performs TRANSPOSITION at end of string', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // Select TRANSPOSITION type
      .mockReturnValueOnce(0.99); // Force last character selection
    expect(addTypo('hello')).toBe('helol');
  });

  test('performs OMISSION typo', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.2) // Select OMISSION type
      .mockReturnValueOnce(0); // Select first character
    expect(addTypo('hello')).toBe('ello');
  });

  test('performs DOUBLING typo', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4) // Select DOUBLING type
      .mockReturnValueOnce(0); // Select first character
    expect(addTypo('hello')).toBe('hhello');
  });

  test('performs SUBSTITUTION typo', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.6) // Select SUBSTITUTION type
      .mockReturnValueOnce(0) // Select first character
      .mockReturnValueOnce(0); // Select first substitution option
    expect(addTypo('hello')).toBe('yello'); // 'h' is replaced with 'y' (first option in commonLetterSubstitutions['h'])
  });

  test('performs CAPITALIZATION typo', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8) // Select CAPITALIZATION type
      .mockReturnValueOnce(0); // Select first character
    expect(addTypo('hello')).toBe('Hello');
  });

  test('performs CAPITALIZATION typo on already capitalized letter', () => {
    mathRandomSpy = vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.8) // Select CAPITALIZATION type
      .mockReturnValueOnce(0); // Select first character
    expect(addTypo('Hello')).toBe('hello');
  });
});
