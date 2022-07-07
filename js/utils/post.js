// trang nhaps.. lucs ddau laf main.js sau doi thanh home.js
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'

export function createPostElement(post) {
  if (!post) return
  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return
  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)

  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if (descriptionElement) titleElement.textContent = post.description

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) titleElement.textContent = post.author

  // caculate timespan
  // cần có import mới chạy dc

  dayjs.extend(relativeTime)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`)
  // console.log('timespan', dayjs(post.updateAt).fromNow())

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Visit+Blogging.com+Now'
    })
  }

  // attach event
  // go to post detail whwn click on div.post-item
  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', () => {
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(event.target)) return

      // event.taget là item mà mình click lên
      // kiểm tra menu có chứa cái mình vừa click không( nếu mình click bất cứ chỗ nào bên trong menu này)
      // thì bỏ va

      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      //C1 dừng bubbling lên cha
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  // add click event for remove button
  const removeButton = liElement.querySelector('[data-id="remove"]')
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      //C1 dừng bubbling lên cha
      // e.stopPropagation()

      const customEvent = new CustomEvent('post-delete', {
        bubbles: true,
        detail: post,
      })

      removeButton.dispatchEvent(customEvent)
    })
  }
  return liElement
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return
  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // trước khi render pagination thì ta phải xóa dữ liệu cũ. .để chuyển trang khác dữ liệu lại kacs
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
