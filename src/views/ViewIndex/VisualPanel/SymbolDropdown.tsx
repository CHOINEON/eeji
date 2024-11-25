import { Dropdown, MenuProps, Space } from 'antd'
import { ISymbol } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { graphDataState, RawDataState, selectedFilterState, SymbolListState, SymbolState } from '../stores/atom'

const categoryItems = [
  { label: 'Metal', key: 'metal' }, // remember to pass the key prop
]

const SymbolDropdown = () => {
  const symbolList = useRecoilValue(SymbolListState)
  const resetGraphData = useResetRecoilState(graphDataState)
  const resetRawData = useResetRecoilState(RawDataState)
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState)
  const [symbol, setSymbol] = useRecoilState(SymbolState)
  const [items, setItems] = useState<MenuProps['items']>([])

  useEffect(() => {
    if (symbolList.length > 0) {
      setSymbol({
        ...symbol,
        symbol_id: symbolList[0].symbol_id,
        period: symbolList[0].period,
        horizons: symbolList[0].horizons,
        selectedHorizon: JSON.parse(symbolList[0].horizons)[0],
        unit: symbolList[0].unit,
      })

      setItems(generateItems())

      function generateItems() {
        return symbolList.map((symbol) => ({
          label: symbol.symbol_id,
          key: symbol.symbol_id,
        }))
      }
    }
  }, [symbolList])

  const onClick: MenuProps['onClick'] = ({ key }) => {
    //prediction, raw data 초기화
    resetGraphData()

    const selectedSymbol = symbolList.find((symbol) => symbol.symbol_id === key) as ISymbol
    setSymbol({
      ...symbol,
      symbol_id: selectedSymbol.symbol_id,
      period: selectedSymbol.period,
      horizons: selectedSymbol.horizons,
      selectedHorizon: JSON.parse(selectedSymbol.horizons)[0],
      unit: selectedSymbol.unit,
      features: selectedSymbol.features,
    })
    setSelectedFilter({ ...selectedFilter, selectedFeatures: [] })
  }

  return (
    <div>
      <Dropdown menu={{ items: categoryItems }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>Metal</Space>
        </a>
      </Dropdown>
      <span className="mx-2">/</span>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
        trigger={['click']}
      >
        <Space>
          <a className="text-blue">{symbol.symbol_id}</a>
        </Space>
      </Dropdown>
    </div>
  )
}

export default SymbolDropdown
