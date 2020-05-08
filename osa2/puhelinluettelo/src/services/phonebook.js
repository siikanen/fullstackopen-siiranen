import axios from 'axios'

const baseURL = 'http://localhost:3001/persons/'

const getAll = () => {
    const req = axios.get(baseURL)
    return req.then(res => res.data)
}

const create = newName => {
    const req = axios.post(baseURL, newName)
    return req.then(res => res.data)
}

const replace = (newName,id) => {
    const req = axios.put(baseURL + id, newName)
    return req.then(res => res.data)
}

const remove = id => {
    const req = axios.delete(baseURL + id)
    return req.then(res => res.data)
}

export default { getAll, create, remove, replace }