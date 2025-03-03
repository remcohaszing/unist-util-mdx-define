/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
export const $0 = '$0'
export const $1 = '$1'
export const a = 'estree export a'
export const b = 'estree export b'
function _createMdxContent(props) {
  return <></>
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
