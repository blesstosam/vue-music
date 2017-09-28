/**
 * 给dom元素增加class
 * @param el
 * @param className
 */
export function addClass(el, className){

    if(hasClass(el, className)){
        return;
    }

    let newClass=el.className.split(' ');
    newClass.push(className);
    el.className=newClass.join(' ');
}


/**
 * 检测是否有某个class
 * @param el
 * @param className
 * @returns {boolean}
 */
export function hasClass(el, className){
    let reg = new RegExp('(^|\\S)'+className+'(\\s|$)');
    return reg.test(el.className);
}



/**
 * 获取dom元素的data-属性值
 * @param el
 * @param name
 * @param val
 * @returns {*}
 */
export function getData(el, name, val) {
    const prefix='data-';
    name = prefix+name;

    if(val){
        return el.setAttribute(name, val);
    }else{
        return el.getAttribute(name);
    }
}



/**
 * 获取浏览器厂商
 */
let elStyle = document.createElement('div').style;

let vendor =(() => {

    let transformNames = {
        webkit :'webkitTransform',
        Moz :'MozTransform',
        O :'OTransform',
        ms :'msTransform',
        standard :'transform'
    };
    for (let key in transformNames) {

        //必须加undefined,因为空字符串条件也为false
        if(elStyle[transformNames[key]] !== undefined) {
            return 'standard';
        }
    }

    return false;
})();


/**
 * 获取dom元素加前缀的style属性
 * @param _style
 * @returns {*}
 */
export function prefixStyle(_style) {

    if (vendor === false) {
        return false;
    }

    if (vendor === 'standard') {
        return _style;
    }

    return vendor + _style.charAt(0).toUpperCase() + _style.substr(1);

}