'use strict'

const gSavedLang = loadLangFromStorage()
var gHammerContainer

function onInit() {
    renderFilterByQueryParams()
    renderBooks()
    setLang(gSavedLang)
    renderLangSelection()
    doTrans()
    renderFooter()
    onSwipe()

    const savedFilterBy = JSON.parse(localStorage.getItem('filterBy'))
    if (savedFilterBy) {
        onSetFilterBy(savedFilterBy)
    }
}

function onSwipe() {
    const elModal = document.querySelector('.modal')
    gHammerContainer = new Hammer(elModal)

    gHammerContainer.on('swipeleft', (ev) => {
        console.log(ev)
        showNextBookModal()
    })

    gHammerContainer.on('swiperight', (ev) => {
        console.log(ev)
        showPrevBookModal()
    })
}

function showNextBookModal() {
    const elModal = document.querySelector('.modal')
    const currBookId = elModal.getAttribute('data-book-id')
    const currIdx = gBooks.findIndex(book => book.id === currBookId)
    const nextIdx = (currIdx + 1) % gBooks.length
    const nextBookId = gBooks[nextIdx].id

    onCloseModal()
    onReadBook(nextBookId)
    addModalContent('Next Book')
}

function showPrevBookModal() {
    const elModal = document.querySelector('.modal')
    const currBookId = elModal.getAttribute('data-book-id')
    const currIdx = gBooks.findIndex(book => book.id === currBookId)
    const prevIdx = (currIdx - 1 + gBooks.length) % gBooks.length
    const prevBookId = gBooks[prevIdx].id

    onCloseModal()
    onReadBook(prevBookId)
    addModalContent('Previous Book')
}

function addModalContent(msg) {
    const elInfoModal = document.querySelector('.readmode-info-modal')
    elInfoModal.classList.remove('hidden')
    elInfoModal.innerText = msg

    setTimeout(() => {
        elInfoModal.classList.add('hidden')
    }, 800);
}

function renderBooks() {
    var books = getBooks()
    const elTable = document.querySelector('.book-table')
    const elTBody = elTable.querySelector('tbody')

    const strHTMLs = books.map(book => `
            <tbody>
            <td>${book.id}</td>
            <td>${book.bookTitle}</td>
            <td>$${book.price}</td>
            <td><i class="fa-solid fa-star fa-xs" style="color: #4267b2;"></i> ${book.rate}</td>
            <td><button class="read-btn" onclick="onReadBook('${book.id}')"><i class="fa-solid fa-circle-info" style="color: #4267b2;"></i></button></td>
            <td><button class="update-btn" onclick="onUpdateBook('${book.id}')"><i class="fa-regular fa-pen-to-square" style="color: #4267b2;"></i></button></td>
            <td><button class="remove-btn" onclick="onRemoveBook('${book.id}')"><i class="fa-solid fa-trash-can" style="color: #fb0404;"></i></button></td>
            </tbody>`
    )
    elTBody.innerHTML = strHTMLs.join('')
    renderFooter()
}

function onAddBook() { // create (Crudl)
    var bookTitle = prompt('Title?')
    var bookPrice = +prompt('Price?, Empty for random price.')
    if (bookTitle) {
        const book = addBook(bookTitle, bookPrice)
        renderBooks()
        if (gCurrLang === 'he') {
            flashMsg(`הספר נוסף בהצלחה`)
        } else if (gCurrLang === 'es') {
            flashMsg(`El libro se ha añadido con éxito`)
        } else if (gCurrLang === 'it') {
            flashMsg(`Il libro è stato aggiunto con successo`)
        } else flashMsg(`Book added (ID: ${book.id})`)
    }

}

function onReadBook(bookId) { //Read (cRudl)
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')

    elModal.setAttribute('data-book-id', bookId)
    elModal.querySelector('h3').innerText = book.bookTitle
    elModal.querySelector('.rate').innerText = book.rate
    elModal.querySelector('.realtime-price').innerText = book.price
    elModal.querySelector('p').innerText = book.desc

    const elImg = elModal.querySelector('img')
    elImg.src = `img/${book.bookTitle}.jpg`
    elImg.onerror = function () {
        elImg.src = 'img/default.jpg'
    }

    elModal.classList.add('open')
}


function onRateChange(changeType) {
    const elModal = document.querySelector('.modal')
    const bookId = elModal.getAttribute('data-book-id')
    const book = getBookById(bookId)

    if (changeType === '+' && book.rate < 10) {
        book.rate++
    } else if (changeType === '-' && book.rate > 1) {
        book.rate--
    }

    updateBookRate(bookId, book.rate)
    renderBooks()
    renderBookDetails(book)
}

function renderBookDetails(book) {
    const elModal = document.querySelector('.modal')

    elModal.querySelector('.rate').textContent = book.rate

    if (elModal.classList.contains('open')) {
        onCloseModal()
        onReadBook(book.id)
    }
}

function updateBookRate(bookId, newRate) {
    const book = gBooks.find(book => book.id === bookId)
    book.rate = newRate
    saveToStorage('bookDB', gBooks)
}

function onUpdateBook(bookId) { // update (crUdl)
    const book = getBookById(bookId)
    var newPrice = +prompt('Price?', book.price)

    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        if (gCurrLang === 'he') {
            flashMsg(`המחיר התעדכן בהצלחה ל$${book.price}`)
        } else if (gCurrLang === 'es') {
            flashMsg(`Precio actualizado a: $${book.price}`)
        } else if (gCurrLang === 'it') {
            flashMsg(`Prezzo aggiornato a: $${book.price}`)
        } else flashMsg(`Price updated to: $${book.price}`)
    }
}

function onUpdateRating() {
    const bookId = document.querySelector('.modal').getAttribute('data-book-id')
}

function onRemoveBook(bookId) { // Delete (cruDl)
    if (gCurrLang === 'he') {
        if (confirm('אתה בטוח שברצונך למחוק ספר זה?')) {
            removeBook(bookId)
            renderBooks()
            flashMsg(`הספר נמחק בהצלחה`)
        }
    } else if (gCurrLang === 'es') {
        if (confirm('¿Seguro que quieres eliminar este libro?')) {
            removeBook(bookId)
            renderBooks()
            flashMsg(`El libro fue eliminado con éxito.`)
        }
    } else if (gCurrLang === 'it') {
        if (confirm('Sei sicuro di voler eliminare questo libro?')) {
            removeBook(bookId)
            renderBooks()
            flashMsg(`Il libro è stato eliminato con successo`)
        }
    } else {
        if (confirm('Are you sure?')) {
            removeBook(bookId)
            renderBooks()
            flashMsg(`Book Deleted`)
        }

    }

}
function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
    filterBy = setBookFilter(filterBy)
    renderBooks()

    localStorage.setItem('filterBy', JSON.stringify(filterBy))

    const queryParams = `?title=${filterBy.title}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        title: queryParams.get('title') || '',
        minRate: +queryParams.get('minRate')
    }

    const savedFilterBy = JSON.parse(localStorage.getItem('filterBy'))
    if (savedFilterBy) {
        Object.assign(filterBy, savedFilterBy)
    }

    if (!filterBy.title && !filterBy.minRate) return

    document.querySelector('.filter-title').value = filterBy.title
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    if (!prop) return

    const sortBy = {}
    sortBy[prop] = (isDesc) ? -1 : 1

    console.log('sortBy', sortBy)

    setBookSort(sortBy)
    renderBooks()
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}

function renderFooter() {
    const priceCounts = getBookByPrice()
    const elFooterTable = document.querySelector('.footer-table')
    const elFooterBody = elFooterTable.querySelector('tbody')

    elFooterBody.innerHTML = `
        <tr>
            <td data-trans="expensive">Expensive:</td>
            <td>${priceCounts.expensive}</td>
        </tr>
        <tr>
            <td data-trans="normal">Normal:</td>
            <td>${priceCounts.normal}</td>
        </tr>
        <tr>
            <td data-trans="cheap">Cheap:</td>
            <td>${priceCounts.cheap}</td>
        </tr>
        `
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    const elMsg = document.querySelector('.user-msg')

    elMsg.innerText = msg
    elMsg.classList.add('open')
    setTimeout(() => elMsg.classList.remove('open'), 3000)
}

function onSetLang(lang) {
    setLang(lang)
    //if lang is hebrew add RTL class to document.body
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    doTrans()
}

function renderLangSelection() {
    const elLangSelect = document.querySelector('.lang-select')
    elLangSelect.innerHTML = `
    <select onchange="onSetLang(this.value)">
    <option value="en" ${gCurrLang === 'en' ? 'selected' : ''}>English</option>
    <option value="es" ${gCurrLang === 'es' ? 'selected' : ''}>Español</option>
    <option value="it" ${gCurrLang === 'it' ? 'selected' : ''}>Italiano</option>
    <option value="he" ${gCurrLang === 'he' ? 'selected' : ''}>עברית</option>
    </select>
    `

    const body = document.body
    if (gCurrLang === 'he') {
        body.classList.add('rtl')
    } else {
        body.classList.remove('rtl')
    }
}