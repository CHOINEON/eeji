export function dateSortAscending(list: any) {
  const sorted_list = list.sort((a: any, b: any) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  return sorted_list
}

export function dateSortDescending(list: Array<any>) {
  const sorted_list = list
    .sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    .reverse()
  return sorted_list
}
