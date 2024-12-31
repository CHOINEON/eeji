import { Dropdown, MenuProps, Space } from 'antd'
import { ISymbol } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { graphDataState, selectedSymbolSelector, symbolState } from '../stores/atom'

const SymbolDropdown = () => {
  const symbols = useRecoilValue(symbolState) //전체 리스트
  const resetGraphData = useResetRecoilState(graphDataState)
  const [selectedSymbol, setSelectedSymbol] = useRecoilState(selectedSymbolSelector) //선택된 symbol

  const [category, setCategory] = useState<string>('All')
  const [topItems, setTopItems] = useState<MenuProps['items']>([])
  const [subItems, setSubItems] = useState<MenuProps['items']>([])

  useEffect(() => {
    if (symbols.symbolList.length > 0) {
      setCategory(symbols.symbolList[0].category)

      setTopItems(generateItems([...new Set(symbols.symbolList.map((symbol) => symbol.category))]))
    }
  }, [symbols.symbolList])

  useEffect(() => {
    const filteredSubItems = symbols.symbolList.filter((symbol) => symbol.category === category)

    //하위 드롭다운 렌더
    setSubItems(generateItems(filteredSubItems))

    //0번째 값 디폴트로 저장
    setSelectedSymbol(filteredSubItems[0])
  }, [category])

  type CategoryOrSymbol = string | ISymbol

  function generateItems(arr: Array<CategoryOrSymbol>) {
    return arr.map((item) => {
      if (typeof item === 'string') {
        // categories 배열 처리
        return {
          label: item,
          key: item,
        }
      } else {
        // symbols 배열 처리
        return {
          label: item.symbol_id,
          key: item.symbol_id,
        }
      }
    })
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    //prediction, raw data 초기화
    resetGraphData()
  }

  const onTopMenuClick = (e: any) => {
    setCategory(e.key)
  }

  return (
    <div>
      <Dropdown menu={{ items: topItems, onClick: onTopMenuClick }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>{category}</Space>
        </a>
      </Dropdown>
      <span className="mx-2">/</span>
      <Dropdown
        menu={{
          items: subItems,
          onClick,
        }}
        trigger={['click']}
      >
        <Space>
          <a className="text-blue">{selectedSymbol.symbol_id}</a>
        </Space>
      </Dropdown>
    </div>
  )
}

export default SymbolDropdown
