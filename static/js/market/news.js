/*
 * Nikulin Vasily © 2021
 */

updatePage()
html = document.getElementsByTagName('html')[0]
window.addEventListener('scroll', function() {
    let height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                          html.clientHeight, html.scrollHeight, html.offsetHeight)
    if (pageYOffset + window.innerHeight + 1 >= height) {
        addNews(k)
    }
})

function updatePage() {
    main = document.getElementsByTagName('main')[0]
    while (document.getElementsByClassName('news').length > 0)
        main.removeChild(document.getElementsByClassName('news')[0])
    k = 0
    was_end = false
    addNews(k)
}

main = document.getElementsByTagName('main')[0]
function addNews(page=0) {
    if (!was_end)
    news.get(page, function (data) {
        if (data['news']) {
            newsList = data['news']
            for (newsId = 0; newsId < newsList.length; newsId++) {
                n = Object(newsList[newsId])
                if (n.picture)
                    picture = `<img id="${ n.id }-picture" src="${ n.picture }" alt="Неверная ссылка на изображение новости" class="rounded img-fluid mx-auto d-block">`
                else
                    picture = ''
                if (n.canEdit)
                    authorButtons = `
                                    <div style="display: inline-flex">
                                        <button onclick="deleteNews('${ n.id }')" class="btn btn-outline-danger btn-delete btn-icon"><span class="material-icons md-red">clear</span></button>
                                        <button onclick="editNews('${ n.id }')" class="btn btn-outline-warning btn-edit btn-icon"><span class="material-icons-round md-yellow">edit</span></button>
                                    </div>`
                else authorButtons = ''
                likes = parseInt(n.likes) > 0 ? " " + n.likes.toString() : ""
                main.innerHTML = main.innerHTML +
                `
                <div class="news" id="${ n.id }" style="border: 1px solid black; border-radius: 5px; margin-bottom: 5px; padding: 5px 5px 0 5px">
                    <table style="width: 100%; border: 0">
                        <tr style="border: 0">
                            <td rowspan="2" style="text-align: left; border: 0; word-wrap: anywhere">
                                <h4 id="${ n.id }-title">${ n.title }</h4>
                            </td>
                            <td style="text-align: right; border: 0">
                                <p style="margin-bottom: 0"><small>${ n.author }</small></p>
                            </td>
                        </tr>
                        <tr style="border: 0">
                            <td style="text-align: right; border: 0">
                                <p style="margin-bottom: 0"><small> ${ n.date }</small></p>
                            </td>
                        </tr>
                    </table>
                    <p id="${ n.id }-text" style="word-break: break-all; white-space: pre-wrap">${ n.message }</p>
                    ${ picture }
                    <table style="width: 100%; border: 0; margin: 5px 0">
                        <tr style="font-size: 1em; border: 0">
                            <td style="text-align: left; border: 0">
                                ${ authorButtons }
                            </td>
                            <td style="text-align: right; border: 0">
                                <button id="${ n.id }-like" onclick="like('${ n.id }')" class="btn btn-outline-danger btn-like btn-icon">
                                    <span id="${ n.id }-like-symbol" class="material-icons-round md-red">favorite${ n.isLiked ? "" : "_border" }</span>
                                    <span id="${ n.id }-like-counter" class="btn-icon-text">${ likes }</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                `
            }
        } else {
            was_end = true
            if (k === 0)
                main.insertAdjacentHTML('beforeend',
                    `
                        <table class="dairy-table table-hover table-info">
                            <tr style="background-color: #86CFDA">
                                <td style="text-align: center;padding: 5px">Новостей нет</td>
                            </tr>
                        </table>
                    `)
        }
        k += 1
    })
}

function createNews() {
    message =
        `<div>
            <div class="form-floating">
                <input id="title-input" class="form-control" placeholder="Заголовок" onclick="valid(this)">
                <label for="title-input">Заголовок</label>
            </div>
            <br>
            <div class="form-floating">
                <textarea id="text-input" class="form-control" placeholder="Текст"></textarea>
                <label for="text-input">Текст</label>
            </div>
            <br>
            <div class="mb-3">
                <label for="image-input">Изображение</label>
                <input type="file" id="image-input" name="illustration" class="form-control" placeholder="Изображение" accept="image/*"  onclick="valid(this)">
            </div>
            <br>
            <div class="form-floating">
                <select id="author-select" class="form-select">
                    <option>от себя</option>
                </select>
                <label for="author-select">Подпись</label>
            </div>
        </div>`
    button = document.createElement('button')
    button.textContent = "Опубликовать"
    button.className = "btn btn-info"
    button.onclick = function () {
        const title = document.getElementById('title-input').value
        if (title) {

            if (document.getElementById('image-input').files.length === 0) {
                const text = document.getElementById('text-input').value
                const author = document.getElementById('author-select')
                const authorValue = author.options[author.selectedIndex].value

                news.post(authorValue, title, text, null, updatePage)
                closeModal()
            } else {
                let image = document.getElementById('image-input').files[0]
                news.uploadImage(image, (data) => {
                    if (data["error"]) {
                        document.getElementById('image-input').classList.add('is-invalid')
                    } else {
                        const text = document.getElementById('text-input').value
                        const imagePath = data["path"]
                        const author = document.getElementById('author-select')
                        const authorValue = author.options[author.selectedIndex].value

                        news.post(authorValue, title, text, imagePath, updatePage)
                        closeModal()
                    }
                })

            }
        } else document.getElementById('title-input').classList.add('is-invalid')
    }
    fillAuthors()
    showModal(message, 'Новый пост', [button])
}

function fillAuthors (selectedValue=null) {
    stocks.get(
        function () {
            stocksJson = stocks.getJson['stocks']
            for (companyId = 0; companyId < stocksJson.length; companyId++) {
                companyTitle = stocksJson[companyId]['company']
                if (selectedValue === companyTitle)
                    selectedIndex = companyId
                $("#author-select").append(new Option('от лица компании "' + companyTitle + '"',
                    companyTitle))
            }
            if (selectedValue)
                document.getElementById('authors-select').selectedIndex = selectedIndex
        }
    )
}

function editNews(id) {
    id = id.toString()
    const titleElement = document.getElementById(id + "-title")
    title = titleElement.textContent
    const textElement = document.getElementById(id + "-text")
    if (textElement)
        text = textElement ? textElement.textContent : ''
    const imageElement = document.getElementById(id + "-picture")
    noImage = !imageElement
    message =
        `<div>
            <div class="form-floating">
                <input id="title-input" class="form-control" placeholder="Заголовок" value="${ title }" onclick="valid(this)">
                <label for="title-input">Заголовок</label>
            </div>
            <br>
            <div class="form-floating">
                <textarea id="text-input" class="form-control" placeholder="Текст">${ text }</textarea>
                <label for="text-input">Текст</label>
            </div>
            <br>
            <div class="mb-3">
                <label for="image-input">Изображение</label>
                <input type="file" id="image-input" name="illustration" class="form-control" placeholder="Изображение" accept="image/*" onclick="valid(this)">
            </div>
            <br>
        </div>`
    button = document.createElement('button')
    button.textContent = "Сохранить"
    button.className = "btn btn-info"
    button.onclick = () => {
        const newTitle = document.getElementById('title-input').value

        if (newTitle) {
            const newText = document.getElementById('text-input').value
            if (document.getElementById('image-input').files.length === 0) {
                news.put(id, newTitle, newText, null, null, updatePage)
                closeModal()
            } else {
                let newImage = document.getElementById('image-input').files[0]
                news.uploadImage(newImage, (data) => {
                    if (data["error"]) {
                        document.getElementById('image-input').classList.add('is-invalid')
                    } else {
                        const newImagePath = data["path"]
                        news.put(id, newTitle, newText, newImagePath, null, updatePage)
                        closeModal()
                    }
                })
            }
        } else document.getElementById('title-input').classList.add('is-invalid')
    }

    btnClear = document.createElement("clear-image")
    btnClear.textContent = "Удалить изображение"
    btnClear.className = "btn btn-info"
    btnClear.onclick = () => {
        news.put(id, null, null, "!clear", null, updatePage)
        closeModal()
    }
    showModal(message, 'Изменение поста', noImage? [button] : [btnClear, button])
}

function deleteNews(id) {
    news.delete(id, function () {
        newsPost = document.getElementById(id)
        main.removeChild(newsPost)
    })
}

function like(id) {
    news.put(id, null, null, null, true, function (data) {
        let likeSymbol = document.getElementById(id + "-like-symbol")
        let likeCounter = document.getElementById(id + "-like-counter")

        if (data["isLiked"]) {
            likeSymbol.textContent = "favorite"
        } else {
            likeSymbol.textContent = "favorite_border"
        }

        if (data["likes"] === 0) {
            likeCounter.textContent = ""
        } else {
            likeCounter.textContent = data["likes"].toString()
        }
    })
}

function valid(element) {
    if (element.classList.contains("is-invalid")) {
        element.classList.remove("is-invalid")
    }
}