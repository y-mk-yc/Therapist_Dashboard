import {useState} from "react";

export const useSetState = <T,>(initial: T[]) => {
    const [items, setItems] = useState(new Set(initial))

    // const addItem  = (value: T) => {  //如果是这样写，会在多次调用addItem时，items的值不会立即更新，因为此时setItems是异步的，所以应该用函数式更新
    //     const newSet = new Set(items)
    //     newSet.add(value)
    //     setItems(newSet)
    //     // console.log(items);
    //     // console.log("a");
    //
    // }
    const addItem = (value: T) => {
        setItems((prevItems) => {
            const newSet = new Set(prevItems);
            newSet.add(value);
            return newSet;
        });
    };

    // const removeItem = (value: T) => {
    //     const newSet = new Set(items)
    //     newSet.delete(value)
    //     setItems(newSet)
    // }

    const removeItem = (value: T) => {
        setItems((prevItems) => {
            const newSet = new Set(prevItems);
            newSet.delete(value);
            return newSet;
        });
    };

    return [
        addItem,
        removeItem,
        items
    ] as const
}