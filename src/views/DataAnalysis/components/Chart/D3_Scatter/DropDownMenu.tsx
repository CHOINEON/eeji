import { Select } from 'antd'
import { useEffect } from 'react'

export const DropdownMenu = (selection: any, props: any) => {
  useEffect(() => console.log('props:', props), [props])

  const { options, onOptionClicked } = props

  let select = selection.selectAll('select').data([null])
  select = select
    .enter()
    .append('select')
    .merge(select)
    .on('change', function (value: any) {
      // Use function declaration for "this" keyword
      onOptionClicked(value)
    })

  const option = select.selectAll('option').data(options)
  return option
    .enter()
    .append('option')
    .merge(option)
    .attr('value', (d: any) => d)
    .text((d: any) => d)

  const handleChange = () => {
    //
  }

  return (
    <>
      <Select
        defaultValue="CSL"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'CSL', label: 'CSL' },
          { value: 'RAFT', label: 'RAFT' },
          { value: '노정압', label: '노정압' },
          { value: '노정온도', label: '노정온도' },
        ]}
      />
      vs
      <Select
        defaultValue="RAFT"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'CSL', label: 'CSL' },
          { value: 'RAFT', label: 'RAFT' },
          { value: '노정압', label: '노정압' },
          { value: '노정온도', label: '노정온도' },
        ]}
      />
    </>
  )
}
