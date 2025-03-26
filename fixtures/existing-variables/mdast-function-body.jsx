;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const $0 = '$0'
  const $1 = '$1'
  const a = 'mdast function-body export a'
  const b = 'mdast function-body export b'
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
    $0,
    $1,
    a,
    b,
    default: MDXContent
  }
})()
