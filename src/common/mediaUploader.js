import firebase from "firebase";

export default class BotoMediaUploader {
    constructor(id = '', media = []) {
        this.userId = id
        this.media = media
    }

    async getMediaList() {
        const list = [];
        if (this.media.length > 0) {
            const storage = firebase.storage();
            for (const file of this.media) {
                if (file.isUploaded) {
                    const {
                        type,
                        url
                    } = file;
                    list.push({
                        type,
                        url
                    });
                } else {
                    const [type, format] = file.type.split('/');
                    const storageRef = storage.ref(`${this.userId}/${file.id}.${format}`);
                    await storageRef.put(file.file, {
                        contentType: file.type
                    })
                    const url = await storageRef.getDownloadURL();
                    list.push({
                        type,
                        url
                    });
                }
            }
        }
        return list;
    }
}