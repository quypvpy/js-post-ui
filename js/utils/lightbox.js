function showModal(modalElement) {
  const modal = new bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  // handle click for all images -> Event Delagation
  // img click -find all imgs with the same album /gallery
  // show modal with selected img
  // hadle pre/next click

  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if modal is registered or not
  if (modalElement.dataset.registered) return

  // selector
  const imageElement = modalElement.querySelector(imgSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album=${target.dataset.album}]`)
    // imgList laf mootj nodelist nên k có hàm findIdeex vì thế phải chueyenr
    currentIndex = [...imgList].findIndex((x) => x === target)
    console.log('album image llick', { target, currentIndex, imgList })

    // show image ai index
    showImageAtIndex(currentIndex)
    // show modal
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', () => {
    // show next image of current album
    // cpos 3 anhr.. %3
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  // mark this modal is already registed
  modalElement.dataset.registered = 'true'
}
