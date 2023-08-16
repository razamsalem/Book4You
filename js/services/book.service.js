'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 10

var gBooks
var gPageIdx = 0
var gFilterBy = { title: '', minRate: 1, minPrice: 0 }

_createBooks()

function setFilterBy(filterBy) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
}

function setBookSort(sortBy = {}) {
    if (sortBy.maxRate !== undefined) {
        gBooks.sort((b1, b2) => (b2.rate - b1.rate) * sortBy.maxRate)
    } else if (sortBy.title !== undefined) {
        gBooks.sort((b1, b2) => b1.bookTitle.localeCompare(b2.bookTitle) * sortBy.title)
    }
}

function getBooks() { //List (crudL)
    var books = gBooks.filter(book =>
        book.bookTitle.toLowerCase().includes(gFilterBy.title) &&
        book.rate >= gFilterBy.minRate &&
        book.price >= gFilterBy.minPrice)

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)

    return books
}


function _createBook(bookTitle, price = getRandomPrice(), rate = getRandomIntInclusive(1, 10)) {
    return {
        id: makeId(),
        bookTitle,
        price,
        rate,
        imgUrl: `img/${bookTitle}.jpg`,
        desc: makeLorem()
    }
}

function _createBooks() {
    const bookTitles = ['Shoe Dog', 'Mindset', 'Steve jobs', 'Schindler\'s List' , 'The Shining' , 'The hunger games' ,'The Silence of the Lambs' , 'The Godfather' , 'Leonardo', 'Harry Potter', 'The Shawshank Redemption' ,'Forrest Gump', 'The Lord of the Rings' , 'American Psycho' ,'Zodiac']
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 357; i++) {
            var randTitle = bookTitles[getRandomIntInclusive(0, bookTitles.length - 1)]
            var book = _createBook(randTitle)
            books.push(book)
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function addBook(bookTitle, bookPrice) { // Create (Crudl)

    if (!bookPrice) {
        bookPrice = getRandomPrice()
    }

    const book = _createBook(bookTitle, bookPrice)
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function getBookByPrice() {
    const priceMap = gBooks.reduce((map, book) => {
        const price = parseFloat(book.price)
        if (price > 10) {
            map.expensive++
        } else if (price >= 5) {
            map.normal++
        } else {
            map.cheap++
        }
        return map
    }, { expensive: 0, normal: 0, cheap: 0 })
    return priceMap
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) gPageIdx = 0
}

function prevPage() {
    gPageIdx--
    if (gPageIdx < 0) {
        const lastPageIndex = Math.floor((gBooks.length - 1) / PAGE_SIZE)
        gPageIdx = lastPageIndex
    }
}

function getBookById(bookId) { // Read (cRudl)
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBook(bookId, newPrice) { //Update (crUdl)
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function removeBook(bookId) {  //Delete (cruDl)
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    if (filterBy.bookTitle !== undefined) gFilterBy.bookTitle = filterBy.bookTitle
    if (filterBy.price !== undefined) gFilterBy.minPrice = filterBy.price
    return gFilterBy
}
