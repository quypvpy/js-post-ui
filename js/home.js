// trang nhaps.. lucs ddau laf main.js sau doi thanh home.js
import postApi from './api/postApi'
import { initPagination, initSeach, renderPagination, renderPostList, toast } from './utils'
// vif dax expoot vo index het r

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)
    // đêtr khi ngta truyền thì mới set.. k thì thôi.

    // nếu muốn lọc input thì ta phải reset page về 1 để nó hiện ra
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    // fetch API
    // re-render post ;ist
    const { data, pagination } = await postApi.getAll(url.searchParams)
    // vaf khi render lại.. thì ta phải xóa dữ liệu cũ.. k thì nó lấy nữa là chồng thêm vô.
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('fail to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  // vif nos bubble leen taanj document nên nó nge dc .. và tên event mình custom cungc dc. k nhất thiết tên đó
  document.addEventListener('post-delete', async (event) => {
    // console.log('remove post list', event.detail)
    // call api to remove id
    // refetch dâta
    try {
      const post = event.detail
      const measege = `Are you sure to remove post "${post.title}"?`
      if (window.confirm(measege)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('Remove post Successfully')
      }
    } catch (error) {
      console.log('failed to remove post', error)
      toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    // update query params
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)

    const queryParams = url.searchParams

    registerPostDeleteEvent()
    // fetch API
    // re-render post ;ist
    // neeuys nhiều filter ta tácgh riêng và làm như này.
    // initFilters({
    //   defaultParams: queryParams,
    //   onChange: (filter) => handleFilterChange()
    // })
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    // mỗi khi có page thay đổi .ông báo lên cho tui..và page là page số mấy..còn tui lấy page làm j kệ tui
    // trong pagion có nhieeug sự kiện ..trong đó next prev số trang ..quy chung sự kieejnj là thay đổi trang
    initSeach({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    // có hỗ trợ param dạng object và URLseachparam
    // const { data, pagination } = await postApi.getAll(queryParams)

    // renderPostList('postList', data)
    // renderPagination('pagination', pagination)
    // 3 dòng trên có thể thay băng hàm dưới...
    handleFilterChange()
  } catch (error) {
    console.log('getall fail', error)
    // show modal
  }
})()
