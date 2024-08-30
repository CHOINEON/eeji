export const transformDataByRow = (limit: number, offset: number, rawData: any) => {
  const transformedData: Array<unknown> = []

  for (let i = offset; i < offset + limit; i++) {
    const newDataPoint: any = {}

    for (const feature in rawData) {
      newDataPoint[feature] = rawData[feature][i]
    }
    transformedData.push(newDataPoint)
  }

  return transformedData
}
