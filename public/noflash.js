;(function () {
    var storageKey = 'theme'
    var classNameDark = 'dark'

    function setClassOnDocumentBody() {
        var html = document.getElementsByTagName('html')[0]
        html.classList.add(classNameDark)
    }

    var preferDarkQuery = '(prefers-color-scheme: dark)'
    var mql = window.matchMedia(preferDarkQuery)
    var supportsColorSchemeQuery = mql.media === preferDarkQuery
    var localStorageTheme = null
    try {
        localStorageTheme = localStorage.getItem(storageKey)
    } catch (err) {}
    var localStorageExists = localStorageTheme !== null

    if (localStorageExists) {
        if (localStorageTheme === classNameDark) {
            setClassOnDocumentBody()
        }
    } else if (supportsColorSchemeQuery) {
        setClassOnDocumentBody()
        localStorage.setItem(storageKey, classNameDark)
    }
})()