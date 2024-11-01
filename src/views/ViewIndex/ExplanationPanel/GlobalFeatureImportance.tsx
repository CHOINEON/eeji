import IndexApi from 'apis/IndexApi'
import { IFeatureImportance } from 'apis/type/IndexResponse'
import { TooltipItem } from 'chart.js'
import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { colorChips } from 'views/AIModelGenerator/components/Chart/colors'
import { selectedIndexState, SymbolState } from '../stores/atom'

const GlobalFeatureImportance = () => {
  const symbol = useRecoilValue(SymbolState)
  const selectedIndex = useRecoilValue(selectedIndexState)

  const [featureImportance, setFeatureImportance] = useState([])

  const { data } = useQuery(
    ['globalExplanation', symbol.symbol_id, selectedIndex.horizon],
    () => IndexApi.getGlobalExplanation(symbol.symbol_id, selectedIndex.horizon.toString()),
    {
      enabled: !!symbol.symbol_id && !!selectedIndex.horizon,
    }
  )

  useEffect(() => {
    if (data) {
      setFeatureImportance(data?.feature_importance)
    }
  }, [data])

  const doughnutData = {
    labels: featureImportance?.map((el: IFeatureImportance) => el.feature_name),
    datasets: [
      {
        label: '',
        data: featureImportance?.map((el: IFeatureImportance) => (el.importance * 100).toFixed(1)),
        backgroundColor: colorChips,
      },
    ],
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
        backgroundColor: '#ccc',
        borderRadius: 3,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 'TOP 3 Features',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw // Use raw value from the tooltip item
            return value + '%' // Append % to the value
          },
        },
      },
    },
  }

  return (
    <>
      <h3 className="text-lg font-bold">Global Feature Importance</h3>
      <div className="m-5 h-[200px]">
        {featureImportance?.length > 0 && (
          <>
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="my-5">
              가장 영향력이 큰 변수는 <strong>{featureImportance[0]?.feature_name} </strong>입니다.
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default GlobalFeatureImportance
