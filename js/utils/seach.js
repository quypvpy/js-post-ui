import debounce from 'lodash.debounce'

export function initSeach({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  // set default value from query params
  // title_like

  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like')
  }

  const debounceSeach = debounce((e) => onChange?.(e.target.value), 500)
  // searchInput.addEventListener('input', (e) => {
  //   // console.log(searchInput.value) cungx dc

  // })
  //  tham soos asu input laf mootj event
  searchInput.addEventListener('input', debounceSeach)
  // khi mỗi lần gõ 1 kí tự nó sẽ gọi debounceSeach ,,đến khi nào dừng 500s
  // sắp tới không gõ nữa nó sẽ gọi hàm onChange
}
