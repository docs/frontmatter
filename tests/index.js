const parse = require('..')
const filepath = 'path/to/file.md'
const fixture1 = `---
title: Hello, World
meaning_of_life: 42
---

I am content.
`

describe('frontmatter', () => {
  it('parses frontmatter and content in a given string (no options required)', () => {
    const { data, content, errors } = parse(fixture1)
    expect(data.title).toBe('Hello, World')
    expect(data.meaning_of_life).toBe(42)
    expect(content.trim()).toBe('I am content.')
    expect(errors.length).toBe(0)
  })

  describe('schema', () => {
    it('is optional', () => {
      const schema = {
        properties: {
          title: {
            type: 'string'
          },
          meaning_of_life: {
            type: 'number'
          }
        }
      }

      const { data, content, errors } = parse(fixture1, { schema })
      expect(data.title).toBe('Hello, World')
      expect(data.meaning_of_life).toBe(42)
      expect(content.trim()).toBe('I am content.')
      expect(errors.length).toBe(0)
    })

    it('creates errors if frontmatter does not conform to schema', () => {
      const schema = {
        properties: {
          meaning_of_life: {
            type: 'number',
            minimum: 50
          }
        }
      }

      const { data, content, errors } = parse(fixture1, { schema })
      expect(data.title).toBe('Hello, World')
      expect(data.meaning_of_life).toBe(42)
      expect(content.trim()).toBe('I am content.')
      expect(errors.length).toBe(1)
      const expectedError = {
        attribute: 'minimum',
        property: 'meaning_of_life',
        expected: 50,
        actual: 42,
        message: 'must be greater than or equal to 50'
      }
      expect(errors[0]).toEqual(expectedError)
    })
  })

  describe('validateKeyNames', () => {
    const schema = {
      properties: {
        age: {
          type: 'number'
        }
      }
    }

    it('creates errors for undocumented keys if `validateKeyNames` is true', () => {
      const { errors } = parse(fixture1, { schema, validateKeyNames: true, filepath })
      expect(errors.length).toBe(2)
      const expectedErrors = [
        {
          property: 'title',
          message: 'not allowed. Allowed properties are: age',
          filepath: 'path/to/file.md'
        },
        {
          property: 'meaning_of_life',
          message: 'not allowed. Allowed properties are: age',
          filepath: 'path/to/file.md'
        }
      ]
      expect(errors).toEqual(expectedErrors)
    })

    it('does not create errors for undocumented keys if `validateKeyNames` is false', () => {
      const { errors } = parse(fixture1, { schema, validateKeyNames: false })
      expect(errors.length).toBe(0)
    })
  })

  describe('validateKeyOrder', () => {
    it('creates errors if `validateKeyOrder` is true and keys are not in order', () => {
      const schema = {
        properties: {
          meaning_of_life: {
            type: 'number'
          },
          title: {
            type: 'string'
          }
        }
      }
      const { errors } = parse(fixture1, { schema, validateKeyOrder: true, filepath })
      const expectedErrors = [
        {
          property: 'keys',
          message: 'keys must be in order. Current: title,meaning_of_life; Expected: meaning_of_life,title',
          filepath: 'path/to/file.md'
        }
      ]
      expect(errors).toEqual(expectedErrors)
    })

    it('does not create errors if `validateKeyOrder` is true and keys are in order', () => {
      const schema = {
        properties: {
          title: {
            type: 'string'
          },
          meaning_of_life: {
            type: 'number'
          }
        }
      }
      const { errors } = parse(fixture1, { schema, validateKeyOrder: true })
      expect(errors.length).toBe(0)
    })
  })
})
