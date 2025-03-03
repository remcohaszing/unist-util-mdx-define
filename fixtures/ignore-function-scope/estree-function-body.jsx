;(() => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
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
  const a = 'estree function-body export a'
  const b = 'estree function-body export b'
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
    functionDeclaration,
    functionExpression,
    arrowFunctionExpression,
    ClassDeclaration,
    ClassExpression,
    a,
    b,
    default: MDXContent
  }
})()
