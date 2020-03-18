(function () {
  //API變數
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  //頁數相關變數
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let newPage = 1
  //set getPagedata()
  let paginationData = []
  const changeIcon = document.querySelector('.change-icon')


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
            <div class="card-body user-item-body">
              <h5 class="card-name">${item.name} ${item.surname}
              </h5>
              <span class="card-age">Age：${item.age}</span>
              <i class="fa fa-heart-o fa-add-favorite" data-id="${item.id}"></i>
            </div>
          </div>
        </div>
      `
      dataPanel.innerHTML = htmlContent
    })
  }

  //設定函數-新增名單(清單式)
  function displayDataList2(data) {
    let htmlContent = '<div class="col list-group">'
    data.forEach(function (item, index) {
      //設置男女背景顏色
      let background
      if (item.gender === 'female') {
        background = 'style="background-color:#FFB7DD"'
      } else {
        background = 'style="background-color:#ADD8E6"'
      }
      htmlContent += `
        <div class="list-group-item d-flex flex-row justify-content-between" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}" ${background}>
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
    const showUserRegion = document.getElementById('show-user-region')
    const showUserAge = document.getElementById('show-user-age')
    const showUserBirthday = document.getElementById('show-user-birthday')
    const showUserEmail = document.getElementById('show-user-email')

    //設定 request url
    const url = INDEX_URL + id
    //導入user modal資料
    axios
      .get(url)
      .then(res => {
        console.log(res.data)
        const data = res.data
        showUserName.innerText = `${data.name} ${data.surname}`
        showUserImage.innerHTML = `<img src='${data.avatar}' class="img-fluid" alt="user image">`
        showUserRegion.innerText = `Region：${data.region}`
        showUserAge.innerText = `Age：${data.age}`
        showUserBirthday.innerText = `Birth：${data.birthday}`
        showUserEmail.innerText = `Email：${data.email}`
      })
  }

  //設定監聽器，點擊卡片會跳出使用者詳細資料
  dataPanel.addEventListener('click', (event) => {
    console.log(event.target)
    const target = event.target.parentElement
    let id
    if (event.target.matches('.fa-add-favorite')) {
      id = event.target.dataset.id
      addFavoriteItem(id)
      showUser(id)
    }
    if (event.target.matches('.list-group-item')) {
      id = event.target.dataset.id
      showUser(id)
    } else if (target.matches('.card')) {
      id = target.dataset.id
      showUser(id)
    } else {
      id = target.parentElement.dataset.id
      showUser(id)
    }

  })

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

  //導入資料
  axios
    .get(INDEX_URL)
    .then((res) => {
      data.push(...res.data.results)
      getTotalPages(data) //總頁數
      getPageDataCard(1, data) //預設畫面
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
    }
  })

  //get search bar element
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

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


