/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
export const a = 'hast export a'
export const b = 'hast export b'
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
