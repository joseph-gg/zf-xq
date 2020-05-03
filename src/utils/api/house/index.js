import api from '../../axios'
export function getFilters(id) {
    return api.get('/houses/condition', {
        params: {
            id
        }
    })
}
export function getHouseListBy (cityId, filters, start, end) {
    return api.get('/houses', {
        params: {
            // 组装的过滤器结构
            cityId,
            ...filters,
            start,
            end
        }
    })
}
export function getDetalByid(id) {
    return api.get(`/houses/${id}`)
}
