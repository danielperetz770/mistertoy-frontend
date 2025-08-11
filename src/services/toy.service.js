import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
// import { userService } from './user.service.js'

const STORAGE_KEY = 'toyDB'
_createToys()

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getRandomToy,
    getDefaultFilter
}

console.log('hey from service!!!!!!!')

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(toys => {

            if (!filterBy.txt) filterBy.txt = ''
            if (!filterBy.maxPrice && filterBy.maxPrice !== 0) filterBy.maxPrice = Infinity
            if (filterBy.inStock === undefined) filterBy.inStock = undefined
            if (!filterBy.labels) filterBy.labels = []

            const txtRegex = new RegExp(filterBy.txt, 'i')

            return toys.filter(toy => {
                const matchesTxt = txtRegex.test(toy.name)
                const matchesPrice = toy.price <= filterBy.maxPrice
                const matchesStock = filterBy.inStock === undefined || toy.inStock === filterBy.inStock


                const matchesLabels = filterBy.labels.length === 0
                    ? true
                    : filterBy.labels.every(label => toy.labels.includes(label))

                return matchesTxt && matchesPrice && matchesStock && matchesLabels
            })
        })
}


function getById(toyId) {
    return storageService.get(STORAGE_KEY, toyId)
}

function remove(toyId) {
    // return Promise.reject('Not now!')
    return storageService.remove(STORAGE_KEY, toyId)
}


function save(toy) {
    if (toy._id) {
        return storageService.put(STORAGE_KEY, toy)
    } else {
        // when switching to backend - remove the next line
        toy.owner = userService.getLoggedinUser()
        return storageService.post(STORAGE_KEY, toy)
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: '',
        inStock: undefined,
        labels: []
    }
}

function getRandomToy() {
    return {
        name: utilService.makeRandomName(),
        price: utilService.getRandomIntInclusive(100, 900),

    }
}

function getDefaultFilter() {
    return {
        txt: '',
        maxPrice: '',
        inStock: undefined,
        labels: []
    }
}

function _createToys() {
    const toys = utilService.loadFromStorage(STORAGE_KEY) || []
    if (!toys || !toys.length) {
        for (let i = 0; i < 8; i++) {
            toys.push(_createToy())
        }
        utilService.saveToStorage(STORAGE_KEY, toys)
    }
}

function _createToy() {
    const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

    const getRandomId = () => 't' + Math.floor(Math.random() * 1000)
    const getRandomName = () => {
        const names = ['Talking Doll', 'Magic Puzzle', 'Racing Car', 'Art Kit', 'Outdoor Ball', 'Robot', 'Baby Blocks']
        return names[Math.floor(Math.random() * names.length)]
    }
    const getRandomLabels = () => {
        const shuffled = labels.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, Math.floor(Math.random() * labels.length) + 1)
    }

    return {
        _id: getRandomId(),
        name: getRandomName(),
        imgUrl: 'hardcoded-url-for-now',
        price: +(Math.random() * 200).toFixed(2),
        labels: getRandomLabels(),
        createdAt: Date.now(),
        inStock: Math.random() > 0.5
    }
}



