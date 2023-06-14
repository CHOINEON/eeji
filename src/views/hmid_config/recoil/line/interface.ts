export interface DLINE {
  mode?: string
  text?: boolean
  textposition?: string
  line: {
    shape?: string
    width?: number
  }
  type?: string
}

export interface LLINE {
  title?: string
  margin: {
    l?: number
    r?: number
    b?: number
    t?: number
  }
  showlegend?: boolean
  xaxis: {
    title?: string
  }
  yaxis: {
    title?: string
  }
}
