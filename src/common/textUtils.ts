export const includesIgnoreCapital: (search: string, value: string) => boolean = (search, value) => {
    return value.toLowerCase().includes(search.toLowerCase())
}
// const search = "apple";
// const value = "I love Apple Pie!";
// const result = includesIgnoreCapital(search, value);
// console.log(result); // 输出: true
export const capitalize = (string: string) => {
    return string.replace(/^\w/, (match) => match.toUpperCase());
}

export const keyToLabel = (key: string) => {
    return capitalize(
        key
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase()
    )
}