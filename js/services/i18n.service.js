'use strict'

const LANG_STOARGE_KEY = 'lang'
let gCurrLang = 'en'

const gTrans = {
    title: {
        en: 'Book4You',
        es: 'Libros Para Ti',
        it: 'Libri Per Te',
        he: 'ספר בשבילך',
    },
    subtitle: {
        en: 'Books we all love',
        es: 'Libros que todos amamos',
        it: 'Libri che tutti amiamo',
        he: 'ספרים שכולנו אוהבים',
    },
    'add-book': {
        en: 'Add a book',
        es: 'nuevo libro',
        it: 'nuovo libro',
        he: 'הוסף ספר'
    },
    filter: {
        en: 'Filter',
        es: 'Filtración',
        it: 'Filtraggio',
        he: 'סינון',
    },
    'min-rate': {
        en: 'Min Rate',
        es: 'Calificación mínima',
        it: 'Valutazione minima',
        he: 'מינימום כוכבים',
    },
    'search-bar': {
        en: 'Look For a book',
        es: 'busca un libro',
        it: 'cercare un libro',
        he: 'חפש ספר',
    },
    'sort-header': {
        en: 'Sort By:',
        es: 'Ordenar por',
        it: 'Ordina per',
        he: 'מיין לפי:',
    },
    'sort-all': {
        en: 'All',
        es: 'todos',
        it: 'Tutti',
        he: 'הכל',
    },
    'sort-title': {
        en: 'Title',
        es: 'título',
        it: 'titolo',
        he: 'כותרת',
    },
    'sort-rate': {
        en: 'Rate',
        es: 'clasificación',
        it: 'valutazione',
        he: 'דירוג',
    },
    'descending-option': {
        en: 'Descending',
        es: 'Descendente',
        it: 'Discendente',
        he: 'סדר יורד',
    },
    'id-name': {
        en: 'Id',
        es: 'Identificación',
        it: 'andare',
        he: 'מזהה',
    },
    'title-name': {
        en: 'Title',
        es: 'Título',
        it: 'Titolo',
        he: 'שם הספר',
    },
    'price-name': {
        en: 'Price',
        es: 'Precio',
        it: 'Prezzo',
        he: 'מחיר',
    },
    'rate-name': {
        en: 'Rating',
        es: 'clasificación',
        it: 'valutazione',
        he: 'דירוג',
    },
    'action-name': {
        en: 'Actions',
        es: 'Acciones',
        it: 'Azioni',
        he: 'פעולות',
    },
    'prev-btn': {
        en: 'Prev Page',
        es: 'Pagina anterior',
        it: 'Pagina precedente',
        he: 'חזור אחורה',
    },
    'next-btn': {
        en: 'Next Page',
        es: 'Siguiente página',
        it: 'Pagina successiva',
        he: 'עמוד הבא',
    },
    category: {
        en: 'Category',
        es: 'Categoría',
        it: 'Categoria',
        he: 'קטגוריה',
    },
    count: {
        en: 'Count',
        es: 'Cantidad',
        it: 'Quantità',
        he: 'כמות',
    },
    description: {
        en: 'Description:',
        es: 'Descripción',
        it: 'Descrizione',
        he: 'תיאור הספר:',
    },
    expensive: {
        en: 'Expensive:',
        es: 'Caro',
        it: 'Costoso',
        he: 'יקר:',
    },
    normal: {
        en: 'Normal:',
        es: 'Normal',
        it: 'Normale',
        he: 'רגיל:',
    },
    cheap: {
        en: 'Cheap:',
        es: 'Barato',
        it: 'Economico',
        he: 'זול:',
    },
}

function getTrans(transKey) {
    //get from gTrans
    const transMap = gTrans[transKey]
    // if key is unknown return 'Unknown Word'
    if (!transMap) return 'Unknown Word'
    let transTxt = transMap[gCurrLang]
    //If translate not found - use english
    if (!transTxt) transTxt = transMap.en
    return transTxt
}


function doTrans() {
    // get the data-trans and use getTrans to replace the innerText
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        //support placeholder and innerText
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
    saveLangToStorage()
}

function saveLangToStorage() {
    saveToStorage(LANG_STOARGE_KEY, gCurrLang)
}

function loadLangFromStorage() {
    return loadFromStorage(LANG_STOARGE_KEY)
}