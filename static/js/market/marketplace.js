/*
 * Nikulin Vasily © 2021
 */

clicked = false
renderPage()

function renderPage() {
    if (!clicked)
        renderElements()
}


function renderElements() {
    wallet.get(renderBalance)
    stocks.get(renderUserStocksTable)
    offers.get(function () {
        renderUserSellStocksTable()
        renderStocksTable()
    })
    companies.get()
}

function deleteOffer(company, stocks, price) {
    offers.delete(company, stocks, price, renderPage)
}

function renderBalance() {
    balance = document.getElementById('balance')
    balance.innerHTML = wallet.money.toString() + '<span class="material-icons-round md-money">paid</span>'
}

function renderUserStocksTable() {
    table = document.getElementById('user-stocks')
    while (table.children.length > 0)
        table.removeChild(table.children[0])
    userStocksTable = document.createElement('table')
    userStocksTable.id = "user-stocks"
    userStocksTable.className = "dairy-table table-hover table-info stocks-table"

    if (stocks.getJson['stocks'].length > 0) {
        userStocksTableCaption = document.createElement('caption')
        userStocksTableCaption.style.captionSide = "top"
        userStocksTableCaption.textContent = _("Ваши акции")

        userStocksTable.appendChild(userStocksTableCaption)

        userStocksTableThead = document.createElement('thead')
        userStocksTableThead.style.backgroundColor = "#86CFDA"
        userStocksTableTheadCompany = document.createElement('td')
        userStocksTableTheadCompany.textContent = _("Компания")
        userStocksTableTheadCompany.style.textAlign = "center"
        userStocksTableTheadCompany.style.padding = "5px"
        userStocksTableTheadStocks = document.createElement('td')
        userStocksTableTheadStocks.textContent = _("Акции")
        userStocksTableTheadStocks.style.textAlign = "center"
        userStocksTableTheadStocks.style.padding = "5px"
        userStocksTableThead.appendChild(userStocksTableTheadCompany)
        userStocksTableThead.appendChild(userStocksTableTheadStocks)
        userStocksTableTbody = document.createElement('tbody')

        userStocks = stocks.getJson['stocks']

        for (stockId = 0; stockId < userStocks.length; stockId++) {
            const row = document.createElement('tr')

            row.onclick = function () {
                sellStocks(this.company, this.stocks)
            }
            row.addEventListener("mouseout", function () {
                clicked = false
                renderElements()

                this.onmouseup = function () {
                    sellStocks(this.company, this.stocks)
                }
            })
            row.addEventListener("mousedown", function () {
                clicked = true
                while (this.children.length > 0)
                    this.removeChild(this.children[0])
                const td = document.createElement('td')
                td.style.textAlign = "center"
                td.textContent = _("Продать акции")
                td.colSpan = 2
                this.onmouseup = function () {
                    clicked = false
                    sellStocks(this.company, this.stocks)
                }
                this.appendChild(td)
            })
            td1 = document.createElement('td')
            td1.textContent = userStocks[stockId]['company']
            row.company = userStocks[stockId]['company']
            td1.style.textAlign = "center"
            td2 = document.createElement('td')
            td2.textContent = userStocks[stockId]['stocks']
            row.stocks = userStocks[stockId]['stocks']
            td2.style.textAlign = "center"
            row.mouseoverTd = document.createElement('td')
            row.appendChild(td1)
            row.appendChild(td2)
            userStocksTableTbody.appendChild(row)
        }

        userStocksTable.appendChild(userStocksTableThead)
        userStocksTable.appendChild(userStocksTableTbody)
    } else {
        userStocksTableThead = document.createElement('thead')
        userStocksTableThead.style.backgroundColor = "#86CFDA"
        userStocksTableTheadNotStocks = document.createElement('td')
        userStocksTableTheadNotStocks.textContent = _("У вас нет акций")
        userStocksTableTheadNotStocks.style.textAlign = "center"
        userStocksTableTheadNotStocks.style.padding = "5px"
        userStocksTableThead.appendChild(userStocksTableTheadNotStocks)
        userStocksTable.appendChild(userStocksTableThead)
    }
    document.getElementById('user-stocks').appendChild(userStocksTable)
}

function renderUserSellStocksTable() {
    table = document.getElementById('user-sell-stocks')
    while (table.children.length > 0)
        table.removeChild(table.children[0])
    myStocks = []
    for (stockId = 0; stockId < offers.getJson['offers'].length; stockId++) {
        if (offers.getJson['offers'][stockId]['is_mine'])
            myStocks.push(offers.getJson['offers'][stockId])
    }

    if (myStocks.length > 0) {

        userSellStocksTable = document.createElement('table')
        userSellStocksTable.id = "user-sell-stocks"
        userSellStocksTable.className = "dairy-table table-hover table-info stocks-table"

        userSellStocksTableCaption = document.createElement('caption')
        userSellStocksTableCaption.style.captionSide = "top"
        userSellStocksTableCaption.textContent = _("Ваши акции на торговой площадке")

        userSellStocksTable.appendChild(userSellStocksTableCaption)

        userSellStocksTableThead = document.createElement('thead')
        userSellStocksTableThead.style.backgroundColor = "#86CFDA"
        userSellStocksTableTheadCompany = document.createElement('td')
        userSellStocksTableTheadCompany.textContent = _("Компания")
        userSellStocksTableTheadCompany.style.textAlign = "center"
        userSellStocksTableTheadCompany.style.padding = "5px"
        userSellStocksTableTheadStocks = document.createElement('td')
        userSellStocksTableTheadStocks.textContent = _("Акции")
        userSellStocksTableTheadStocks.style.textAlign = "center"
        userSellStocksTableTheadStocks.style.padding = "5px"
        userSellStocksTableTheadReservedStocks = document.createElement('td')
        userSellStocksTableTheadReservedStocks.textContent = _("Зарезервировано")
        userSellStocksTableTheadReservedStocks.style.textAlign = "center"
        userSellStocksTableTheadReservedStocks.style.padding = "5px"
        userSellStocksTableTheadPrice = document.createElement('td')
        userSellStocksTableTheadPrice.textContent = _("Цена за 1 акцию")
        userSellStocksTableTheadPrice.style.textAlign = "center"
        userSellStocksTableTheadPrice.style.padding = "5px"
        userSellStocksTableThead.appendChild(userSellStocksTableTheadCompany)
        userSellStocksTableThead.appendChild(userSellStocksTableTheadStocks)
        userSellStocksTableThead.appendChild(userSellStocksTableTheadReservedStocks)
        userSellStocksTableThead.appendChild(userSellStocksTableTheadPrice)
        userSellStocksTableTbody = document.createElement('tbody')

        for (stockId = 0; stockId < myStocks.length; stockId++) {
            const row = document.createElement('tr')
            row.onclick = function () {
                deleteOffer(this.company, this.stocks, this.price)
            }
            row.addEventListener("mouseout", function () {
                clicked = false
                renderElements()

                this.onmouseup = function () {
                    deleteOffer(this.company, this.stocks, this.price)
                }
            })
            row.addEventListener("mousedown", function () {
                clicked = true
                while (this.children.length > 0)
                    this.removeChild(this.children[0])
                const td = document.createElement('td')
                td.style.textAlign = "center"
                td.textContent = _("Снять с продажи")
                td.colSpan = 4
                this.onmouseup = function () {
                    clicked = false
                    deleteOffer(this.company, this.stocks, this.price)
                }
                this.appendChild(td)
            })

            const td1 = document.createElement('td')
            td1.textContent = myStocks[stockId]['company']
            td1.style.textAlign = "center"
            const td2 = document.createElement('td')
            td2.textContent = myStocks[stockId]['stocks']
            td2.style.textAlign = "center"
            const td3 = document.createElement('td')
            td3.textContent = myStocks[stockId]['reserved_stocks']
            td3.style.textAlign = "center"
            const td4 = document.createElement('td')
            td4.textContent = myStocks[stockId]['price']
            td4.style.textAlign = "center"
            row.company = myStocks[stockId]['company']
            row.stocks = myStocks[stockId]['stocks']
            row.reservedStocks = myStocks[stockId]['reserved_stocks']
            row.price = myStocks[stockId]['price']
            row.appendChild(td1)
            row.appendChild(td2)
            row.appendChild(td3)
            row.appendChild(td4)
            userSellStocksTableTbody.appendChild(row)
        }
        userSellStocksTable.appendChild(userSellStocksTableThead)
        userSellStocksTable.appendChild(userSellStocksTableTbody)
        document.getElementById('user-sell-stocks').appendChild(userSellStocksTable)
    }
}

function renderStocksTable() {
    table = document.getElementById('marketplace-stocks')
    while (table.children.length > 0)
        table.removeChild(table.children[0])
    offersJson = offers.getJson['offers']

    sellStocksTable = document.createElement('table')
    sellStocksTable.id = "user-sell-stocks"
    sellStocksTable.className = "dairy-table table-hover table-info stocks-table"

    sellStocksTableCaption = document.createElement('caption')
    sellStocksTableCaption.style.captionSide = "top"
    sellStocksTableCaption.textContent = _("Торговая площадка")
    sellStocksTable.appendChild(sellStocksTableCaption)

    if (offersJson.length > 0) {
        sellStocksTableThead = document.createElement('thead')
        sellStocksTableThead.style.backgroundColor = "#86CFDA"
        sellStocksTableTheadCompany = document.createElement('td')
        sellStocksTableTheadCompany.textContent = _("Компания")
        sellStocksTableTheadCompany.style.textAlign = "center"
        sellStocksTableTheadCompany.style.padding = "5px"
        sellStocksTableTheadStocks = document.createElement('td')
        sellStocksTableTheadStocks.textContent = _("Акции")
        sellStocksTableTheadStocks.style.textAlign = "center"
        sellStocksTableTheadStocks.style.padding = "5px"
        sellStocksTableTheadReservedStocks = document.createElement('td')
        sellStocksTableTheadReservedStocks.textContent = _("Зарезервировано")
        sellStocksTableTheadReservedStocks.style.textAlign = "center"
        sellStocksTableTheadReservedStocks.style.padding = "5px"
        sellStocksTableTheadPrice = document.createElement('td')
        sellStocksTableTheadPrice.textContent = _("Цена за 1 акцию")
        sellStocksTableTheadPrice.style.textAlign = "center"
        sellStocksTableTheadPrice.style.padding = "5px"
        sellStocksTableThead.appendChild(sellStocksTableTheadCompany)
        sellStocksTableThead.appendChild(sellStocksTableTheadStocks)
        sellStocksTableThead.appendChild(sellStocksTableTheadReservedStocks)
        sellStocksTableThead.appendChild(sellStocksTableTheadPrice)
        sellStocksTableTbody = document.createElement('tbody')

        for (stockId = 0; stockId < offersJson.length; stockId++) {
            const row = document.createElement('tr')
            row.canEdit = offersJson[stockId]['is_mine']
            row.onclick = function () {
                showBuyModal(this)
            }
            row.addEventListener("mouseout", function () {
                clicked = false
                renderElements()
                if (!this.canEdit)
                    this.onmouseup = function () {
                        showBuyModal(this)
                    }

            })
            row.onmousedown = function () {
                clicked = true
                while (this.children.length > 0)
                    this.removeChild(this.children[0])
                const td = document.createElement('td')
                td.style.textAlign = "center"

                if (!this.canEdit)
                    td.textContent = _("Купить акции")
                else
                    td.textContent = _("Это ваши акции)")

                td.colSpan = 4
                this.appendChild(td)
            }

            row.onmouseup = function () {
                if (!this.canEdit) {
                    clicked = false
                    showBuyModal(this)
                } else
                    renderElements()
            }

            const td1 = document.createElement('td')
            td1.textContent = offersJson[stockId]['company']
            td1.style.textAlign = "center"
            const td2 = document.createElement('td')
            td2.textContent = offersJson[stockId]['stocks']
            td2.style.textAlign = "center"
            const td3 = document.createElement('td')
            td3.textContent = offersJson[stockId]['reserved_stocks']
            td3.style.textAlign = "center"
            const td4 = document.createElement('td')
            td4.textContent = offersJson[stockId]['price']
            td4.style.textAlign = "center"
            row.company = offersJson[stockId]['company']
            row.stocks = offersJson[stockId]['stocks']
            row.reservedStocks = offersJson[stockId]['reserved_stocks']
            row.price = offersJson[stockId]['price']
            row.appendChild(td1)
            row.appendChild(td2)
            row.appendChild(td3)
            row.appendChild(td4)
            sellStocksTableTbody.appendChild(row)
        }
        sellStocksTable.appendChild(sellStocksTableThead)
        sellStocksTable.appendChild(sellStocksTableTbody)
        main = document.getElementsByTagName('main')[0]
    } else {
        sellStocksTableThead = document.createElement('thead')
        sellStocksTableThead.style.backgroundColor = "#86CFDA"
        sellStocksTableTheadNotStocks = document.createElement('td')
        sellStocksTableTheadNotStocks.textContent = _("Нет предложений")
        sellStocksTableTheadNotStocks.style.textAlign = "center"
        sellStocksTableTheadNotStocks.style.padding = "5px"
        sellStocksTableThead.appendChild(sellStocksTableTheadNotStocks)
        sellStocksTable.appendChild(sellStocksTableThead)
    }
    document.getElementById('marketplace-stocks').appendChild(sellStocksTable)
}

function createCheque(company, stocks, isBuy) {
    offers.put(company, stocks, isBuy, '', createChequeResponse)
}

function createChequeResponse() {
    if (offers.putJson['message'] === 'Error' &&
        offers.putJson['errors'][0] === 'Not enough stocks')
        showModal(createParagraph(_('На торговой площадке нет свободных акций этой компании')))
    else {
        renderPage()
        offersJson = offers.putJson['offers']
        const message = document.createElement('div')

        if (!offers.putJson['isEnough'])
            message.appendChild(createParagraph(_('ВНИМАНИЕ: На торговой площадке не хватает' +
                ' акций. Вам предложены акции, имеющиеся в наличии.')))

        chequeTable = document.createElement('table')
        chequeTable.id = "cheque"
        chequeTableCaption = document.createElement('caption')
        chequeTableCaption.style.captionSide = "top"
        chequeTableCaption.textContent = _("Чек")
        chequeTable.appendChild(chequeTableCaption)
        chequeTable.className = "dairy-table table-hover table-info"
        tableHeaders = [_('Компания'), _('Акции'), _('Цена'), _('Стоимость'), _('Комиссия')]
        chequeTableThead = document.createElement('thead')
        chequeTableThead.style.backgroundColor = "#86CFDA"
        for (headerId = 0; headerId < tableHeaders.length; headerId++) {
            const th = document.createElement('th')
            th.textContent = tableHeaders[headerId]
            th.style.textAlign = "center"
            chequeTableThead.appendChild(th)
        }
        chequeTable.appendChild(chequeTableThead)

        chequeTableTbody = document.createElement('tbody')

        total = 0
        keys = ['company', 'stocks', 'price', 'cost', 'fee']
        for (stockId = 0; stockId < offersJson.length; stockId++) {
            const row = document.createElement('tr')
            for (keyId = 0; keyId < keys.length; keyId++) {
                const td = document.createElement('td')
                td.textContent = offersJson[stockId][keys[keyId]]
                td.style.textAlign = "center"
                row.appendChild(td)
                if (keys[keyId] === 'cost')
                    total += parseFloat(td.textContent)
                if (keys[keyId] === 'fee')
                    total += parseFloat(td.textContent)
            }
            chequeTableTbody.appendChild(row)
        }
        const row = document.createElement('tr')
        const tdTotal = document.createElement('td')
        tdTotal.textContent = _("Итого") + ': ' + total
        tdTotal.style.textAlign = "center"
        tdTotal.colSpan = 5
        row.appendChild(tdTotal)
        chequeTableTbody.appendChild(row)
        chequeTable.appendChild(chequeTableTbody)
        message.appendChild(chequeTable)

        buttonAccept = document.createElement('button')
        buttonAccept.type = 'button'
        buttonAccept.className = "btn btn-info"
        buttonAccept.onclick = function () {
            clearTimeout(timeoutId)
            offers.put(null, null, 'accept', offers.putJson, checkBuyResponse)
        }
        buttonAccept.textContent = _('Подтвердить')

        buttonDecline = document.createElement('button')
        buttonDecline.type = 'button'
        buttonDecline.className = "btn btn-info"
        buttonDecline.onclick = function () {
            clearTimeout(timeoutId)
            offers.put(null, null, 'decline', offers.putJson, closeModalAndRenderPage)
        }
        buttonDecline.textContent = _('Отклонить')
        timeoutId = setTimeout(declineBuying, 16384)
        showModal(message, _('Купить акции'), [buttonAccept, buttonDecline])
    }
}

function sellStocks(company_title, max_stocks) {
    table = document.getElementById('user-sell-stocks')
    while (table.children.length > 0)
        table.removeChild(table.children[0])
    message = document.createElement('div')

    const companyTitleDiv = document.createElement('div')
    companyTitleDiv.className = "form-floating"
    const companyTitleSelect = document.createElement('select')
    companyTitleSelect.className = "form-select"
    companyTitleSelect.type = "text"
    companyTitleSelect.id = "company-title"
    companyTitleSelect.placeholder = _("Компания")
    companyTitleSelect.readOnly = true

    stocksJson = stocks.getJson['stocks']
    for (companyId = 0; companyId < stocksJson.length; companyId++) {
        const company = stocksJson[companyId]['company']
        if (company.toString() === company_title.toString())
            selectIndex = companyId
        companyTitleSelect.append(new Option(company, company))
    }

    companyTitleSelect.selectedIndex = selectIndex

    companyTitleDiv.appendChild(companyTitleSelect)
    const companyTitleLabel = document.createElement('label')
    companyTitleLabel.htmlFor = "company-title"
    companyTitleLabel.textContent = _("Компания")
    companyTitleDiv.appendChild(companyTitleLabel)

    const stocksCountDiv = document.createElement('div')
    stocksCountDiv.className = "form-floating"
    const stocksCountInput = document.createElement('input')
    stocksCountInput.className = "form-control"
    stocksCountInput.type = "number"
    stocksCountInput.id = "stocks-input"
    stocksCountInput.placeholder = _("Акции")
    stocksCountInput.min = "1"
    stocksCountInput.max = max_stocks
    stocksCountDiv.appendChild(stocksCountInput)
    const stocksCountLabel = document.createElement('label')
    stocksCountLabel.htmlFor = "company-title"
    stocksCountLabel.textContent = _("Акции")
    stocksCountDiv.appendChild(stocksCountLabel)

    const priceDiv = document.createElement('div')
    priceDiv.className = "form-floating"
    const priceInput = document.createElement('input')
    priceInput.className = "form-control"
    priceInput.type = "number"
    priceInput.id = "price-input"
    priceInput.placeholder = _("Цена за 1 акцию")
    priceInput.min = "1"
    priceDiv.appendChild(priceInput)
    const priceLabel = document.createElement('label')
    priceLabel.htmlFor = "company-title"
    priceLabel.textContent = _("Цена за 1 акцию")
    priceDiv.appendChild(priceLabel)

    message.appendChild(companyTitleDiv)
    message.appendChild(document.createElement('br'))
    message.appendChild(stocksCountDiv)
    message.appendChild(document.createElement('br'))
    message.appendChild(priceDiv)

    buttonAccept = document.createElement('button')
    buttonAccept.type = 'button'
    buttonAccept.className = "btn btn-info"
    buttonAccept.onclick = function () {
        const company = document.getElementById('company-title').value
        const stocks = document.getElementById('stocks-input').value
        const price = document.getElementById('price-input').value
        if (stocks <= 0)
            showModal(createParagraph(_('Количество акций должно быть больше нуля.')))
        else if (price <= 0)
            showModal(createParagraph(_('Цена должна быть больше нуля.')))
        else
            offers.post(company, stocks, price, checkSellResponse)
    }
    buttonAccept.textContent = _('Подтвердить')

    buttonDecline = document.createElement('button')
    buttonDecline.type = 'button'
    buttonDecline.className = "btn btn-info"
    buttonDecline.onclick = function () {
        closeModal()
    }
    buttonDecline.textContent = _('Отклонить')

    showModal(message, _('Продать акции'), [buttonAccept, buttonDecline])
}

function declineBuying() {
    offers.put(null, null, 'decline', offers.putJson, closeModalAndRenderPage)
}

function showBuyModal(row) {
    const message = document.createElement('div')
    const companyTitleDiv = document.createElement('div')
    companyTitleDiv.className = "form-floating"
    const companyTitleSelect = document.createElement('select')
    companyTitleSelect.className = "form-select"
    companyTitleSelect.type = "text"
    companyTitleSelect.id = "companies-select"
    companyTitleSelect.placeholder = _("Компания")
    companyTitleSelect.readOnly = true
    companyTitleSelect.value = row.company
    companyTitleDiv.appendChild(companyTitleSelect)
    const companyTitleLabel = document.createElement('label')
    companyTitleLabel.htmlFor = "company-title"
    companyTitleLabel.textContent = _("Компания")
    companyTitleDiv.appendChild(companyTitleLabel)

    offersJson = offers.getJson['offers']
    companiesList = []

    for (offerId = 0; offerId < offersJson.length; offerId++)
        if (!(offersJson[offerId]['company'] in companiesList))

            companiesList.push(offersJson[offerId]['company'])

    companiesJson = companies.getJson['companies']

    for (sectorId = 0; sectorId < Object.keys(companiesJson).length; sectorId++) {
        const sector = Object.keys(companiesJson)[sectorId]
        const optGroup = document.createElement('optgroup')
        optGroup.label = sector
        for (companyId = 0; companyId < companiesJson[sector].length; companyId++) {
            const company = companiesJson[sector][companyId]
            if (companiesList.indexOf(company) !== -1)
                optGroup.append(new Option(company, company))
        }
        if (optGroup.children.length > 0)
            companyTitleSelect.append(optGroup)
    }

    for (companyId = 0; companyId < companyTitleSelect.options.length; companyId++) {
        const company = companyTitleSelect.options[companyId].textContent
        if (company === row.company)
            selectIndex = companyId
    }

    companyTitleSelect.selectedIndex = selectIndex

    const stocksCountDiv = document.createElement('div')
    stocksCountDiv.className = "form-floating"
    const stocksCountInput = document.createElement('input')
    stocksCountInput.className = "form-control"
    stocksCountInput.type = "number"
    stocksCountInput.id = "stocks-input"
    stocksCountInput.placeholder = _("Акции")
    stocksCountInput.value = row.stocks
    stocksCountInput.min = "1"
    stocksCountDiv.appendChild(stocksCountInput)
    const stocksCountLabel = document.createElement('label')
    stocksCountLabel.htmlFor = "company-title"
    stocksCountLabel.textContent = _("Акции")
    stocksCountDiv.appendChild(stocksCountLabel)

    message.appendChild(companyTitleDiv)
    message.appendChild(document.createElement('br'))
    message.appendChild(stocksCountDiv)

    const button = document.createElement('button')
    button.className = "btn btn-info"
    button.onclick = function () {
        const company = document.getElementById('companies-select').value
        const stocks = document.getElementById('stocks-input').value
        if (stocks <= 0)
            showModal(createParagraph(_('Количество акций должно быть больше нуля.')))
        else
            createCheque(company, stocks, 'cheque')
    }
    button.textContent = _("Купить акции")
    showModal(message, _("Купить акции"), [button], true)
}

function checkSellResponse() {
    closeModalAndRenderPage()
    if (offers.postJson['message'] === 'Error')
        showModal(createParagraph(_('У Вас нет такого количества акций данной компании.')))
}

function checkBuyResponse() {
    if (offers.putJson['message'] === 'Error') {
        if (offers.putJson['errors'][0] === 'You do not have enough money')
            showModal(createParagraph(_('На Вашем счёте недостаточно средств.')))
        offers.put(null, null, 'decline', offers.prevPutJson)
    } else
        closeModalAndRenderPage()
}

function openInvestForm() {
    message =
        `<div>
            <div class="form-floating">
                <input class="form-control" list="user-select-options" id="user-select" placeholder="Введите имя пользователя" autocomplete="off">
                <datalist id="user-select-options">
                    <option>Загрузка пользователей...</option>
                </datalist>
                <label for="user-select">${ _('Пользователь') }</label>
            </div>
            <br>
            <div class="form-floating">
                <input id="money-input" class="form-control" placeholder="Сумма">
                <label for="money-input">${ _('Размер инвестиции') }</label>
            </div>
        </div>`
    fillWallets()
    button = `<button class="btn btn-info" onclick="invest()">${ _('Инвестировать') }</button>`


    showModal(message, 'Инвестиция', [button])
}

function fillWallets() {
    wallet.getWallets(function (data) {
        let userSelect = document.getElementById('user-select-options')
        let walletsList = data['wallets']
        for (walletId = 0; walletId < Object.keys(walletsList).length; walletId++) {
            let option = new Option()
            option.value = Object.keys(walletsList)[walletId]
            option.text = walletsList[Object.keys(walletsList)[walletId]]
            userSelect.appendChild(option)
        }
        userSelect.removeChild(userSelect.querySelector('#user-select-options > option:nth-child(1)'))
    })
}

function invest() {
    let userSelect = document.getElementById('user-select-options')
    let name = document.getElementById('user-select').value
    let walletOption = userSelect.querySelector(`#user-select-options > option[value='${name}']`)
    if (walletOption) {
        let walletId = walletOption.textContent
        let money = document.getElementById('money-input').value
        wallet.patch(walletId, money, investCallback)
    } else
        showModal(createParagraph('Кошелёк не найден.'))
}

function investCallback(data) {
    if (data['message'] === 'Success')
        showModal(createParagraph('Инвестиция прошла успешно.'))
    else if (data['errors'][0] === 'Specify money')
        showModal(createParagraph('Укажите сумму.'))
    else if (data['errors'][0] === 'Money must be real number')
        showModal(createParagraph('Сумма инвестиции должна быть вещественным числом' +
            ' больше нуля.'))
    else if (data['errors'][0] === 'Not enough money')
        showModal(createParagraph('Недостаточно средств.'))
    else if (data['errors'][0] === 'Wallet not found')
        showModal(createParagraph('Кошелёк не найден.'))
    renderPage()
}