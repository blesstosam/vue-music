/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min);

}


/**
 * 打乱数组顺序
 * 洗牌算法
 * @param arr
 */
export function shuffle(arr) {

    let _arr = arr.slice();
    for (let i = 0; i<_arr.length; i++) {
        let j = getRandomInt(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }

    return _arr;

}


/**
 * 截流函数
 * @param func
 * @param delay
 * @returns {Function}
 */
export function debounce(func, delay) {

    let timer;

    //该函数是一个闭包，所以timer会一直存在于内存中，并且timer只能在函数内部访问
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }

}