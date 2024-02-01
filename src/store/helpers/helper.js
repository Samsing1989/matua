export function isMatchFilter(item, filter) {
    if (filter.name) {
        if (!item.name.toLowerCase().includes(filter.name.toLowerCase())) return false
    }
    if (filter.priceFrom) {
        if (filter.priceFrom > item.price) return false
    }
    if (filter.priceTo) {
        if (filter.priceTo < item.price) return false
    }
    return true
}
