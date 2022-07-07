import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="description"]', formValues?.description)
  setFieldValue(form, '[name="author"]', formValues?.author)

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl)
  //   dungf input ẩn để lấy link ảnh dễ hơn.
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}
function getFormValues(form) {
  const formValues = {}

  //   C1
  ;['title', 'description', 'author', 'imageUrl'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) formValues[name] = field.value
  })

  //   c2 phair cos name
  //   những trạng thái disable  uncheck sẽ bỏ qua
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}
function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  // vì có await
  try {
    // reset previous error
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

    //  start validation
    const schema = getPostSchema()
    // abortEarly để nó handle tất cả lỗi xảy ra
    await schema.validate(formValues, { abortEarly: false })
    // validate nếu mà hợp lêj ..thì nó nhảy xuống const isValid..
    // validate k hợp lệ.. thì bay vô catch. .xong sau đó vẫn chạy tiếp const isValid..
    //
  } catch (error) {
    // ValidationError: name
    // .inner: là cái mảng chứa lỗi
    console.log(error.name)
    console.log(error.inner)

    const errorLog = {}

    // path : author,title..,
    // validationError tên mặc định khi nó có lỗi.
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        // để nó lấy show cái lỗi đầu tiên trong cái mảng lỗi
        if (errorLog[name]) continue
        setFieldError(form, name, validationError.message)

        errorLog[name] = true
      }
    }
  }
  // add was-validated class to form element
  // xuống tới đây ..nó thấy form hợp lệ.. vì lúc đầu ta reset set setFieldError là " ",,
  // rỗng thì nó hợp lệ..và nó k vô catch thì nó k set error j hết. nên nó k set feilderror
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
  // vì form checkValidity trả về true false
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at -least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('please random a background image').url('Please enter valid url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('max-3mb', 'this image is too large (max-3mb)', (file) => {
          const fileSize = file?.size || 0
          const MAX_SIZE = 3 * 1024 * 1024 // 3mb
          // const MAX_SIZE = 3 * 1024  // 3kb
          return fileSize <= MAX_SIZE
        }),
    }),
  })
}
// ở phần .test.. nếu k chọn files.. thì nó vẫn có..thuộc tính là một object file ladf truethy value..nhưng mà phần name trong files(0) bị rỗng..
// vig thế ta k set requied dc.. mà phải kiểm tra cái name có rỗng hay không.

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '')

    const schema = getPostSchema()
    // k cos abortEarly để nó cos looix trar ve
    await schema.validateAt(name, formValues)
    // name: image,title..,
  } catch (error) {
    setFieldError(form, name, error.message)
  }

  // add class was-validated cha của nó..chứ k phải vào form
  // show validation error
  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1378/400`

    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    //   dungf input ẩn để lấy link ảnh dễ hơn.
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}
function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}
function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    // console.log('selected file', event.target.files[0])
    // vì kiểu dữ liệu nó là fileslisst.. vì có murtipart..
    // nên files[0] là lấy ảnh đầu tiên

    // get selected files
    // preview file(đưa ảnh mới lên)

    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      // console.log(imageUrl)
      setBackgroundImage(document, '#postHeroImage', imageUrl)
      validateFormField(
        form,
        {
          imageSource: ImageSource.uploadImage,
          image: file,
        },
        'image'
      )
      // vì k phải submit nên k có imageSource,image ..nên ta phải truyền vào.
      // image:file .. thì nó gọi tới hàm getpostschema ..thì nó có lấy file.name để nó handle là đúng logic
    }
  })
}

function initValidationOnChange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value
        validateFormField(form, { [name]: newValue }, name)
        // neeuw name là title thì : title:newvalue.vì là biến nên đặt []
      })
    }
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  setFormValues(form, defaultValues)

  // init events
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)
  initValidationOnChange(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    // console.log('submit form')

    // vis duj..nos đang call api ..mà mình click tiếp.. thì nó vô này tiếp.. thì nó là true.
    if (submitting) {
      return
    }

    // showLoading/ disable button
    showLoading(form)
    submitting = true

    // get form value
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id
    // add id để pk add edit.. vì edit thì defaultValues có id.
    // console.log(formValues)

    // vì form checkValidity trả về true false
    // nếu k hợp lệ thì return .vì k thể nào submit
    // validatePostForm vì là hàm async nên trả về là promise..
    // mà promise là một giá trị truethy...nên mình phải chờ nó chạy xong...
    // hay trong video async thì để lấy giá trị hàm đó.. thì phải dùng await async trả về promise.

    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    // ở cha truyền xuống (add-edit-pót ) là hàm asyn
    // vì k có await thì nó chưa kịp call api xong thig nó đã hide

    hideLoading(form)
    submitting = false
  })
}
