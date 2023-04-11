import * as React from 'react'

export class Base extends React.PureComponent {
  rendereComplete() {
    /**custom render complete function */
  }
  componentDidMount() {
    setTimeout(() => {
      this.rendereComplete()
    })
  }
}
export function updateSampleSection() {
  console.log('update!!!!!!!!!!')
}
