import { Dropdown, MenuProps, Space } from 'antd'
import { ISymbol } from 'apis/type/IndexResponse'
import { useEffect, useState } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import { graphDataState, horizonState, symbolState } from '../stores/atom'

const SymbolDropdown = () => {
  const [symbols, setSymbols] = useRecoilState(symbolState) //전체 리스트
  const setHorizon = useSetRecoilState(horizonState)
  const resetGraphData = useResetRecoilState(graphDataState)

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
    setSymbols({
      ...symbols,
      selectedSymbolData: filteredSubItems[0],
    })
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
    //symbol 업데이트
    setSymbols({
      ...symbols,
      selectedSymbolData: symbols.symbolList.filter((symbol) => symbol.symbol_id === key)[0],
    })

    const symbol = symbols.symbolList.find((symbol) => symbol.symbol_id === key)

    //horizon 업데이트
    setHorizon({
      horizonList: JSON.parse(symbol.horizons),
      selectedHorizon: JSON.parse(symbol.horizons)[0],
    })
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
          <a className="text-blue">{symbols.selectedSymbolData?.symbol_id}</a>
        </Space>
      </Dropdown>
    </div>
  )
}

export default SymbolDropdown
