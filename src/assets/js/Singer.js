export default class Singer {
    constructor(_id, _name,_singerId) {
        this.id = _id;
        this.name = _name;
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${_id}.jpg?max_age=2592000`,
        this.singerId = _singerId;
    }
}
