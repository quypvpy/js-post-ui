import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}
function removeUnusedFields(formValues) {
  // imageSource='picsum -> remove image
  // imageSource='upload' -> remove imageUrl
  // finally -> -> remove imageSource
  const payload = { ...formValues }

  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }
  delete payload.imageSource

  // remove id if its add mode
  if (!payload.id) delete payload.id
  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }
  return formData
}

async function handlePostFormSubmit(formValues) {
  // pphần dữ liệu chuẩn bị lên api gọi là payload
  try {
    // check add/edit mode
    // throw new Error('error form throw testting')

    // S1 base on search params (check id)
    // S2 check id in formValues
    // call API

    // k lấy trực tiếp await postApi.add(formValues)
    // mà phải dùng biến savepost
    // khi mà update sẽ lấy kq trả về gắn vào savepost ... Nhớ là kq trả về..
    // vì khi add thì lúc đầu id chưa có.. khi add xong trả về nó sẽ tự tạo id  ..lúc đó mới có

    const payload = removeUnusedFields(formValues)
    const formData = jsonToFormData(payload)

    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    // show sucess measege
    toast.success('Save post successfully!')

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 2000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Error:${error.message}`)
  }
}
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
      // onSubmit: (formValues) => console.log(formValues),
    })
  } catch (error) {
    console.log('failed to fetch post details:', error)
  }
})()
