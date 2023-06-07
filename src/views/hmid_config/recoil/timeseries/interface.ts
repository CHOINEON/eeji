export interface DTIME {
  mode?: string
  text?: boolean
  textposition?: string
  // line: {
  //   shape?: string
  //   width?: number
  // }
  type?: string
}

export interface LTIME {
  title?: string
  margin: {
    l?: number
    r?: number
    b?: number
    t?: number
  }
  showlegend?: boolean
  xaxis: {
    rangeselector?: any
    rangeslider?: any
    autorange?: boolean
  }
  yaxis: {
    autorange?: boolean
  }
}
