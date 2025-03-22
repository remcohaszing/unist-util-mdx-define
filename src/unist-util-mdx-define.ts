import type * as estree from 'estree'
import { createVisitors } from 'estree-util-scope'
import { walk } from 'estree-walker'
import type * as hast from 'hast'
import type * as mdast from 'mdast'
import { type VFile } from 'vfile'

export namespace define {
  /**
   * A mapping of variables to define. They keys are the names. The values are the ESTree expression
   * to represent them.
   */
  export type Variables = Record<string, estree.Expression>

  /**
   * Options for {@link define}
   */
  export interface Options {
    /**
     * If and how to export the variable.
     *
     * - `'module'`: Export the value using an ESM const export declaration.
     * - `'namespace'`: Attach the value as a property on `MDXContent`.
     * - `false`: Define the variable locally, but don’t export it.
     *
     * @default 'module'
     */
    export?: 'module' | 'namespace' | false | undefined

    /**
     * What to do if there’s a name conflict.
     *
     * - `skip`: Don’t insert the variable if there’s a name conflict.
     * - `throw`: Throw if there’s a name conflict.
     * - `warn`: Emit a vfile warning, but don’t throw.
     *
     * @default 'throw'
     */
    conflict?: 'skip' | 'throw' | 'warn' | undefined
  }
}

/**
 * @param program
 *   The ESTree program to scan.
 * @param file
 *   The {@link VFile} to emit warnings to.
 * @param variables
 *   The variables that should be injected.
 * @param options
 *   {@link define}.options
 * @returns
 *   The position in the body where `_createMdxContent` is defined.
 */
function scan(
  program: estree.Program,
  file: VFile,
  variables: Map<string, estree.Expression>,
  options: define.Options | undefined
): number {
  const visitors = createVisitors()
  const [scope] = visitors.scopes
  const identifiers = new Map<string, estree.Identifier>()
  let createMdxContentIndex = -1

  walk(program, {
    enter(node) {
      visitors.enter(node)
      switch (node.type) {
        case 'Identifier':
          if (scope.defined.includes(node.name) && !identifiers.has(node.name)) {
            identifiers.set(node.name, node)
          }
          break

        case 'ArrowFunctionExpression':
        case 'ClassDeclaration':
        case 'ClassExpression':
        case 'FunctionExpression':
          this.skip()
          break

        case 'FunctionDeclaration':
          this.skip()

          if (node.id.name === '_createMdxContent') {
            createMdxContentIndex = program.body.indexOf(node)
          }
          break

        default:
      }
    },
    leave: visitors.exit
  })

  for (const name of scope.defined) {
    if (variables.has(name)) {
      if (options?.conflict !== 'skip') {
        const identifier = identifiers.get(name)
        const message = file.message(`Variable name conflict: ${name}`, {
          place: identifier?.loc,
          ruleId: 'conflict',
          source: 'unist-util-mdx-define'
        })
        message.url = 'https://github.com/remcohaszing/unist-util-mdx-define'

        if (options?.conflict !== 'warn') {
          message.fatal = true
          throw message
        }
      }

      variables.delete(name)
    }
  }

  return createMdxContentIndex
}

/**
 * Generate an export named declaration.
 *
 * @param variables
 *   The variables for which to generate an declaration.
 * @param options
 *   {@link define} options
 * @param returnStatement
 *   The return statement of the program to inject into.
 * @returns
 *   The export named declaration.
 */
function generate(
  variables: Map<string, estree.Expression>,
  options: define.Options | undefined,
  returnStatement?: estree.ReturnStatement | undefined
): (estree.ModuleDeclaration | estree.Statement)[] {
  if (options?.export === 'namespace') {
    const statements: estree.Statement[] = []

    for (const [name, right] of variables) {
      statements.push({
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          left: {
            type: 'MemberExpression',
            computed: false,
            object: { type: 'Identifier', name: 'MDXContent' },
            optional: false,
            property: { type: 'Identifier', name }
          },
          operator: '=',
          right
        }
      })
    }

    return statements
  }

  const declarations: estree.Declaration[] = []

  for (const [name, init] of variables) {
    declarations.push({
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name },
          init
        }
      ]
    })
  }

  if (options?.export === false) {
    return declarations
  }

  if (!returnStatement) {
    return declarations.map<estree.ExportNamedDeclaration>((declaration) => ({
      type: 'ExportNamedDeclaration',
      declaration,
      specifiers: []
    }))
  }

  if (returnStatement.argument?.type === 'ObjectExpression') {
    returnStatement.argument.properties.splice(
      -1,
      0,
      ...Array.from(
        variables.keys(),
        (name): estree.Property => ({
          type: 'Property',
          computed: false,
          kind: 'init',
          method: false,
          shorthand: true,
          key: { type: 'Identifier', name },
          value: { type: 'Identifier', name }
        })
      )
    )
  }

  return declarations
}

/**
 * Define variables in an MDX related AST.
 *
 * @param ast
 *   The AST in which to define an export
 * @param file
 *   The {@link VFile} to emit warnings to.
 * @param variables
 *   A mapping of variables to define. They keys are the names. The values are the ESTree expression
 *   to represent them.
 * @param options
 *   Additional options to configure behaviour.
 */
export function define(
  ast: estree.Program | hast.Root | mdast.Root,
  file: VFile,
  variables: define.Variables,
  options?: define.Options | undefined
): undefined {
  const map = new Map(Object.entries(variables))

  if (ast.type === 'root') {
    for (const child of ast.children) {
      if (child.type !== 'mdxjsEsm') {
        continue
      }

      const program = child.data?.estree

      /* c8 ignore start */
      if (!program) {
        continue
      }

      /* c8 ignore stop */

      scan(program, file, map, options)
    }

    if (map.size) {
      ast.children.push({
        type: 'mdxjsEsm',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: generate(map, options)
          }
        }
      })
    }
  } else {
    const returnStatement = ast.body.find((node) => node.type === 'ReturnStatement')
    const createMdxContentIndex = scan(ast, file, map, options)
    if (map.size) {
      let index = createMdxContentIndex
      if (index === -1 && returnStatement) {
        index = ast.body.indexOf(returnStatement)
      }

      if (index === -1) {
        index = ast.body.length
      }

      ast.body.splice(createMdxContentIndex, 0, ...generate(map, options, returnStatement))
    }
  }
}
