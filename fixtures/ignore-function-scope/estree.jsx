/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
export function functionDeclaration() {
  let a
}
export const functionExpression = function () {
  let a
}
export const arrowFunctionExpression = () => {
  let a
}
export class ClassDeclaration {
  a
}
export const ClassExpression = class {
  a
}
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
