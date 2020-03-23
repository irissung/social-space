(function () {
  //API變數
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  let id
  //頁數相關變數
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let newPage = 1
  //set getPageData()
  let paginationData = []
  const changeIcon = document.querySelector('.change-icon')
  //modal變數
  const showUserInfo = document.getElementById('show-user-info')
  //get search bar element
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')


  //設定函數-新增名單(卡片式)
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      //設置男女背景顏色
      let background
      if (item.gender === 'female') {
        background = 'style="background-color:#FFB7DD"'
      } else {
        background = 'style="background-color:#ADD8E6"'
      }
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}" ${background}>
            <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
            <div class="card-body user-item-body" data-id="${item.id}">
              <h5 class="card-name">${item.name}
              <i class="fa fa-heart-o fa-add-favorite" data-id="${item.id}"></i>
              </h5>
              <h5 class="card-age">${item.age}</h5>
            </div>
          </div>
        </div>
      `
      dataPanel.innerHTML = htmlContent
    })
  }

  //設定函數-新增名單(清單式)
  function displayDataList2(data) {
    let htmlContent = '<div class="col list-group" data-toggle="modal" data-target="#show-user-modal">'
    data.forEach(function (item, index) {
      //設置男女背景顏色
      let background
      if (item.gender === 'female') {
        background = 'style="background-color:#FFB7DD"'
      } else {
        background = 'style="background-color:#ADD8E6"'
      }
      htmlContent += `
        <div class="list-group-item" ${background} data-id="${item.id}">
          <img class="list-img" src="${item.avatar}" alt="List image cap"></img>
          <h5 class="list-name" style="line-height:60px">${item.name} ${item.surname}</h5>
          <h5 class="list-region" style="line-height:60px">${item.region}
          <h5 class="list-age" style="line-height:30px">${item.age}
          <div class="button-list">
            <!-- favorite button -->
            <i class="fa fa-heart-o fa-add-favorite" data-id="${item.id}"></i>
          </div>
        </div>`
    })
    htmlContent += '</div>'
    dataPanel.innerHTML = htmlContent
  }

  //設定函數-modal資料
  function showUser(id) {
    //設定modal的變數
    const showUserName = document.getElementById('show-user-name')
    const showUserImage = document.getElementById('show-user-image')

    //設定 request url
    const url = INDEX_URL + id
    //導入user modal資料
    axios
      .get(url)
      .then(res => {
        const data = res.data
        showUserName.innerHTML = `${data.name} ${data.surname}`
        showUserImage.innerHTML = `<img src='${data.avatar}' class="img-fluid" alt="user image">`

        const htmlContent = `
          <p><em id="show-user-region">Region：${data.region}</em></p>
          <p id='show-user-age'>Age：${data.age}</p>
          <p id="show-user-birthday">Birth：${data.birthday}</p>
          <p id="show-user-email">Email：${data.email}</p>
          <i class="fa fa-heart-o fa-add-favorite" data-id="${data.id}"></i>
        `
        showUserInfo.innerHTML = htmlContent
      })
  }

  //設定函數-最愛清單
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
    const user = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list`)
    } else {
      list.push(user)
      alert(`Added ${user.name} to your favorite list!`)
    }
    localStorage.setItem('favoriteUser', JSON.stringify(list))
  }

  //設定監聽器，點擊卡片會跳出使用者詳細資料
  dataPanel.addEventListener('click', (event) => {
    //點擊愛心可以將user新增至最愛清單
    if (event.target.matches('.fa-add-favorite')) {
      id = event.target.dataset.id
      addFavoriteItem(id)
      event.stopPropagation()
    }
    //提取事件目標的tagName,利用path來尋找ID
    if (event.currentTarget.tagName.toLowerCase() === 'div') {
      if (event.path[1].dataset.id === undefined) {
        id = event.path[0].dataset.id
        showUser(id)
      } else {
        id = event.path[1].dataset.id
        showUser(id)
      }
    }
  })

  //設定監聽器，點擊modal中的愛心可以添加user到最愛清單
  showUserInfo.addEventListener('click', (event) => {
    if (event.target.matches('.fa-add-favorite')) {
      addFavoriteItem(id)
    }
  })

  //設定頁數函數
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}"> ${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //分頁函數-卡片模式
  function getPageDataCard(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
  //分頁函數-清單模式
  function getPageDataList(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList2(pageData)
  }
  //分頁函數-分頁樣式
  function pageStyle(pageNum, data) {
    pageNum = Number(pageNum)
    const pageItem = pagination.querySelectorAll('.page-item')
    //移除其他頁數的active
    pageItem.forEach(item => item.classList.remove('active'))
    //點選頁數時加入active
    const selectPage = pagination.querySelectorAll(`[data-page="${pageNum}"]`)
    selectPage.forEach(item => item.parentElement.classList.add('active'))
  }

  //導入資料
  axios
    .get(INDEX_URL)
    .then((res) => {
      data.push(...res.data.results)
      getTotalPages(data) //總頁數
      getPageDataCard(1, data) //預設畫面
      pageStyle(1, data)//預設頁數
    })
    .catch((err) => console.log(err))

  //設定監聽器-點選清單模式或卡片模式時改變顯示方式
  changeIcon.addEventListener('click', event => {
    if (event.target.matches('.fa-bars')) {
      getPageDataList(newPage, data)
    } else {
      getPageDataCard(newPage, data)
    }
  })

  //設定監聽器-點選頁數時依照清單模式或卡片模式顯示
  pagination.addEventListener('click', event => {
    let tagName = dataPanel.firstElementChild.tagName
    if (event.target.tagName === 'A') {
      newPage = event.target.dataset.page
      if (tagName === 'UL') {
        getPageDataList(newPage, data)
      } else {
        getPageDataCard(newPage, data)
      }
      pageStyle(newPage, data)
    }
  })

  //設定監聽器-搜尋名字
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      user => user.name.toLowerCase().includes(input)
    )
    // console.log(results)
    displayDataList(results)
  })
})()


