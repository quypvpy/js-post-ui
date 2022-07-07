// xử lí DOM hay xử lí j đó.
export function setTextContent(parent, selector, text) {
  if (!parent) return
  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}

// chuữ nhiều thì nó hạn chế lại bao nhiêu và dấu 3 chấm eliipsis charactor nos laf 1 kis tuwj
// https://www.drupal.org/project/drupal/issues/847608
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}

export function setFieldValue(form, selector, value) {
  if (!form) return
  const field = form.querySelector(selector)
  if (field) field.value = value
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return
  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url(${imageUrl})`
  const a = `url(${imageUrl})`
  // console.log(a)
}
export function randomNumber(n) {
  if (n <= 0) return -1
  const random = Math.random() * n
  return Math.round(random)
}
