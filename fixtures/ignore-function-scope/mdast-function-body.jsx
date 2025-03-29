;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const a = 'mdast function-body export a'
  const b = 'mdast function-body export b'
  function functionDeclaration() {
    let a
  }
  const functionExpression = function () {
    let a
  }
  const arrowFunctionExpression = () => {
    let a
  }
  class ClassDeclaration {
    a
  }
  const ClassExpression = class {
    a
  }
  function _createMdxContent(props) {
    return <></>
  }
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {}
    return MDXLayout ? (
      <MDXLayout {...props}>
        <_createMdxContent {...props} />
      </MDXLayout>
    ) : (
      _createMdxContent(props)
    )
  }
  return {
    a,
    b,
    functionDeclaration,
    functionExpression,
    arrowFunctionExpression,
    ClassDeclaration,
    ClassExpression,
    default: MDXContent
  }
})()
