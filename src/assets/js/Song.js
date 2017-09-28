
import {getLyric} from '@/api/index.js'
import {Base64} from 'js-base64';

export default class Song {

	//对象的结构赋值
    constructor({id, mid, singer, name, album, duration, image, url}) {
	    this.id = id;
	    this.mid = mid;
	    this.singer = singer;
	    this.name = name;
	    this.album = album;
	    this.duration = duration;
	    this.image = image;
	    this.url = url;
    }

    getLyric() {

    	if (this.lyric) {
    		return Promise.resolve(this.lyric);
    	}

    	return new Promise((resolve, reject) => {
    		getLyric(this.mid, (data) => {
    			if (data && data.lyric) {
                    this.lyric = Base64.decode(data.lyric);
                    resolve(this.lyric);
                }else {
    				reject('getLyric err...')
				}
    		})
    	})
    }
}


export function createSong(_musicData) {

	return new Song ({
		id : _musicData.songid,
		mid : _musicData.songmid,
	    singer : filterSinger(_musicData.singer),
	    name : _musicData.songname,
	    album : _musicData.albumname,
	    duration : 	_musicData.interval,
	    image : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${_musicData.albummid}.jpg?max_age=2592000`,
	    //音乐播放地址
	    url : `http://ws.stream.qqmusic.qq.com/${_musicData.songid}.m4a?fromtag=46`
	}) 

}


export function filterSinger(singer) {

	let ret = [];
	if(!singer){
		return [];
	}
	singer.forEach((val)=>{
		ret.push(val.name);
	});

	return ret.join('/');
}