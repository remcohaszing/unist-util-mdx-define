import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { compileSync } from '@mdx-js/mdx'
import { parse } from 'acorn'
import { generate } from 'astring'
import type * as estree from 'estree'
import type * as hast from 'hast'
import type * as mdast from 'mdast'
import { assertEqual, testFixturesDirectory } from 'snapshot-fixtures'
import { define } from 'unist-util-mdx-define'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'

/**
 * A unified plugin that defines variable.
 *
 * @param variables
 *   The variables to define.
 * @param options
 *   The options
 * @returns
 *   A unified transformer
 */
function plugin(variables: define.Variables, options?: define.Options) {
  return (ast: estree.Program | hast.Root | mdast.Root, file: VFile): undefined => {
    define(ast, file, variables, options)
  }
}

/**
 * Wrap content in an IIFE.
 *
 * @param content
 *   The content to wrap.
 * @returns
 *   The wrapped content as a string.
 */
function iife(content: unknown): string {
  return `(async () => {${content}})()`
}

testFixturesDirectory<define.Options>({
  directory: new URL('../fixtures', import.meta.url),
  prettier: true,
  write: true,
  tests: {
    'estree.jsx'(input, options) {
      return compileSync(input, {
        jsx: true,
        recmaPlugins: [
          [
            plugin,
            {
              a: { type: 'Literal', value: 'estree export a' },
              b: { type: 'Literal', value: 'estree export b' }
            },
            options
          ]
        ]
      })
    },

    'estree-function-body.jsx'(input, options) {
      return iife(
        compileSync(input, {
          jsx: true,
          outputFormat: 'function-body',
          recmaPlugins: [
            [
              plugin,
              {
                a: { type: 'Literal', value: 'estree function-body export a' },
                b: { type: 'Literal', value: 'estree function-body export b' }
              },
              options
            ]
          ]
        })
      )
    },

    'hast.jsx'(input, options) {
      return compileSync(input, {
        jsx: true,
        rehypePlugins: [
          [
            plugin,
            {
              a: { type: 'Literal', value: 'hast export a' },
              b: { type: 'Literal', value: 'hast export b' }
            },
            options
          ]
        ]
      })
    },

    'hast-function-body.jsx'(input, options) {
      return iife(
        compileSync(input, {
          jsx: true,
          outputFormat: 'function-body',
          rehypePlugins: [
            [
              plugin,
              {
                a: { type: 'Literal', value: 'hast function-body export a' },
                b: { type: 'Literal', value: 'hast function-body export b' }
              },
              options
            ]
          ]
        })
      )
    },

    'mdast.jsx'(input, options) {
      return compileSync(input, {
        jsx: true,
        remarkPlugins: [
          [
            plugin,
            {
              a: { type: 'Literal', value: 'mdast export a' },
              b: { type: 'Literal', value: 'mdast export b' }
            },
            options
          ]
        ]
      })
    },

    'mdast-function-body.jsx'(input, options) {
      return iife(
        compileSync(input, {
          jsx: true,
          outputFormat: 'function-body',
          remarkPlugins: [
            [
              plugin,
              {
                a: { type: 'Literal', value: 'mdast function-body export a' },
                b: { type: 'Literal', value: 'mdast function-body export b' }
              },
              options
            ]
          ]
        })
      )
    }
  }
})

describe('name conflict', () => {
  describe('throw', () => {
    test('estree', () => {
      assert.throws(
        () => {
          compileSync('export const a = 1', {
            recmaPlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'throw' }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'Variable name conflict: a')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'conflict')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          assert.deepEqual(error.place, {
            end: { column: 14, line: 1, offset: 14 },
            start: { column: 13, line: 1, offset: 13 }
          })
          return true
        }
      )
    })

    test('hast', () => {
      assert.throws(
        () => {
          compileSync('export const a = 1', {
            rehypePlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'throw' }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'Variable name conflict: a')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'conflict')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          assert.deepEqual(error.place, {
            end: { column: 14, line: 1, offset: 14 },
            start: { column: 13, line: 1, offset: 13 }
          })
          return true
        }
      )
    })

    test('mdast', () => {
      assert.throws(
        () => {
          compileSync('export const a = 1', {
            remarkPlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'throw' }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'Variable name conflict: a')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'conflict')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          assert.deepEqual(error.place, {
            end: { column: 14, line: 1, offset: 14 },
            start: { column: 13, line: 1, offset: 13 }
          })
          return true
        }
      )
    })
  })

  describe('warn', () => {
    test('estree', () => {
      const vfile = compileSync('export const a = 1', {
        recmaPlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'warn' }]]
      })

      assert.equal(vfile.messages.length, 1)
      const [message] = vfile.messages
      assert.ok(message instanceof VFileMessage)
      assert.equal(message.reason, 'Variable name conflict: a')
      assert.equal(message.fatal, false)
      assert.equal(message.ruleId, 'conflict')
      assert.equal(message.source, 'unist-util-mdx-define')
      assert.equal(message.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
      assert.deepEqual(message.place, {
        end: { column: 14, line: 1, offset: 14 },
        start: { column: 13, line: 1, offset: 13 }
      })
    })

    test('hast', () => {
      const vfile = compileSync('export const a = 1', {
        rehypePlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'warn' }]]
      })

      assert.equal(vfile.messages.length, 1)
      const [message] = vfile.messages
      assert.ok(message instanceof VFileMessage)
      assert.equal(message.reason, 'Variable name conflict: a')
      assert.equal(message.fatal, false)
      assert.equal(message.ruleId, 'conflict')
      assert.equal(message.source, 'unist-util-mdx-define')
      assert.equal(message.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
      assert.deepEqual(message.place, {
        end: { column: 14, line: 1, offset: 14 },
        start: { column: 13, line: 1, offset: 13 }
      })
    })

    test('mdast', () => {
      const vfile = compileSync('export const a = 1', {
        remarkPlugins: [[plugin, { a: { type: 'Literal', value: 2 } }, { conflict: 'warn' }]]
      })

      assert.equal(vfile.messages.length, 1)
      const [message] = vfile.messages
      assert.ok(message instanceof VFileMessage)
      assert.equal(message.reason, 'Variable name conflict: a')
      assert.equal(message.fatal, false)
      assert.equal(message.ruleId, 'conflict')
      assert.equal(message.source, 'unist-util-mdx-define')
      assert.equal(message.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
      assert.deepEqual(message.place, {
        end: { column: 14, line: 1, offset: 14 },
        start: { column: 13, line: 1, offset: 13 }
      })
    })
  })

  describe('internal', () => {
    test('_createMdxContent', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { _createMdxContent: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: _createMdxContent')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })

    test('_Fragment', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { _Fragment: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: _Fragment')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })

    test('_jsx', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { _jsx: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: _jsx')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })

    test('_jsxs', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { _jsxs: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: _jsxs')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })

    test('_missingMdxReference', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { _missingMdxReference: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: _missingMdxReference')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })

    test('MDXContent', () => {
      assert.throws(
        () => {
          compileSync('', {
            recmaPlugins: [[plugin, { MDXContent: { type: 'Literal', value: 2 } }]]
          })
        },
        (error) => {
          assert.ok(error instanceof VFileMessage)
          assert.equal(error.reason, 'MDX internal name conflict: MDXContent')
          assert.equal(error.fatal, true)
          assert.equal(error.ruleId, 'internal')
          assert.equal(error.source, 'unist-util-mdx-define')
          assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
          return true
        }
      )
    })
  })

  test('invalid identifier', () => {
    assert.throws(
      () => {
        compileSync('', {
          recmaPlugins: [[plugin, { ':(': { type: 'Literal', value: 2 } }]]
        })
      },
      (error) => {
        assert.ok(error instanceof VFileMessage)
        assert.equal(error.reason, 'Invalid identifier name: :(')
        assert.equal(error.fatal, true)
        assert.equal(error.ruleId, 'invalid-identifier')
        assert.equal(error.source, 'unist-util-mdx-define')
        assert.equal(error.url, 'https://github.com/remcohaszing/unist-util-mdx-define')
        return true
      }
    )
  })

  test('invalid identifier namespace', () => {
    const result = String(
      compileSync('', {
        jsx: true,
        recmaPlugins: [
          [plugin, { ':)': { type: 'Literal', value: ':D' } }, { export: 'namespace' }]
        ]
      })
    )
    assertEqual(
      result,
      `/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
MDXContent[":)"] = ":D";
function _createMdxContent(props) {
  return <></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
`
    )
  })
})

describe('function-body', () => {
  test('missing _createMdxContent', () => {
    const code = `
    const a = 1
    return {}
  `
    const file = new VFile(code)
    const ast = parse(code, {
      allowReturnOutsideFunction: true,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }) as estree.Program
    define(ast, file, { b: { type: 'Literal', value: 2 } })
    const result = generate(ast)
    assertEqual(
      result,
      `const b = 2;
const a = 1;
return {
  b
};
`
    )
  })

  test('missing _createMdxContent and return', () => {
    const code = `
    const a = 1
  `
    const file = new VFile(code)
    const ast = parse(code, {
      allowReturnOutsideFunction: true,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }) as estree.Program
    define(ast, file, { b: { type: 'Literal', value: 2 } })
    const result = generate(ast)
    assertEqual(
      result,
      `export const b = 2;
const a = 1;
`
    )
  })
})
