

export const commonParams = {
    g_tk: '5381',
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0
};


/**
 * jsonp实现原理
 * jsonp模块创建一个<script>标签
 * src为url并加上'jsonpCallback'参数
 * 后台拿到这个参数的value值：$Callback=$_GET['jsonpCallback']
 * 返回一个$Callback. "(" . $json_data . ")"字符串，其实是一个函数的调用，函数名为传入的value值
 * jsonp定义一个以该参数名为函数名的函数，当返回数据时就会自动调用该函数
 * 该函数将字符串解析为json对象即可
 * 至于传参的key值是和后台约定好的
 */
export const options = {
    param:'jsonpCallback'   //这个key值是前台和后台约定好的
};

export const ERR_OK = 0;