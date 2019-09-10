const parse = require('..')

const fixture1 = `---
title: Hello, World
meaning_of_life: 42
---

I am content.
`

describe('frontmatter', () => {
  it('parses frontmatter and content in a given string', () => {
    const { data, content } = parse(fixture1)
    expect(data.title).toBe('Hello, World')
    expect(data.meaning_of_life).toBe(42)
    expect(content.trim()).toBe('I am content.')
  })

  it('accepts an optional schema for validation', () => {
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
    expect(errors.length).toBe(1)
    const expectedError = {
      attribute: 'minimum',
      property: 'meaning_of_life',
      expected: 50,
      actual: 42,
      message: 'must be greater than or equal to 50'
    }
    expect(errors[0]).toEqual(expectedError)

    expect(content.trim()).toBe('I am content.')
  })

  it.todo('creates errors for undocumented keys if `validateKeyNames` is true')

  it.todo('validates key order if `validateKeyOrder` is true')

  it.todo('includes filepath in schema validation errors, if specified')

  it.todo('includes filepath in key name validation errors, if specified')
})
