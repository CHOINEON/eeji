import { Dropdown, MenuProps, Space } from 'antd'
import { ISymbol } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { SymbolListState, SymbolState } from '../stores/atom'

const categoryItems = [
  { label: 'Metal', key: 'metal' }, // remember to pass the key prop
]

const SymbolDropdown = () => {
  const [symbol, setSymbol] = useRecoilState(SymbolState)
  const symbolList = useRecoilValue(SymbolListState)
  // const [dropdown, setDropdown] = useState(false)
  const [items, setItems] = useState<MenuProps['items']>([])

  useEffect(() => {
    console.log(symbolList)
    if (symbolList.length > 0) {
      setSymbol({
        symbol_id: symbolList[0].symbol_id,
        period: symbolList[0].period,
        horizons: symbolList[0].horizons,
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
    // console.log(symbolList.find((symbol) => symbol.symbol_id === key))
    setSymbol(symbolList.find((symbol) => symbol.symbol_id === key) as ISymbol)
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
