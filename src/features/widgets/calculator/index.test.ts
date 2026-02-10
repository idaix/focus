import { describe, it, expect } from 'vitest'
import { safeEvaluate } from './index'

describe('Calculator Widget', () => {
  it('should evaluate simple addition', () => {
    expect(safeEvaluate('2+2')).toBe(4)
  })

  it('should evaluate multiplication', () => {
    expect(safeEvaluate('3*5')).toBe(15)
  })

  it('should handle division', () => {
    expect(safeEvaluate('10/2')).toBe(5)
  })

  it('should handle complex expressions', () => {
    expect(safeEvaluate('(2+3)*4')).toBe(20)
  })

  it('should return Error for invalid input', () => {
    expect(safeEvaluate('2+abc')).toBe('Error')
  })

  it('should return Error for syntax errors', () => {
    expect(safeEvaluate('2++2')).toBe('Error') 
  })
  
  it('should return Error for clearly invalid syntax', () => {
      expect(safeEvaluate('2+*2')).toBe('Error')
  })

  // Scientific Tests
  it('should evaluate sin', () => {
      expect(safeEvaluate('sin(0)')).toBe(0)
      expect(safeEvaluate('sin(pi/2)')).toBe(1)
  })

  it('should evaluate cos', () => {
      expect(safeEvaluate('cos(0)')).toBe(1)
      expect(safeEvaluate('cos(pi)')).toBe(-1)
  })

  it('should evaluate sqrt', () => {
      expect(safeEvaluate('sqrt(16)')).toBe(4)
  })

  it('should evaluate power', () => {
      expect(safeEvaluate('2^3')).toBe(8)
  })

  it('should evaluate log', () => {
      expect(safeEvaluate('log(100)')).toBe(2)
  })
})
