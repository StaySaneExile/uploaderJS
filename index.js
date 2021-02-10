import './upload'
import {upload} from "./upload";


upload('#file', {
    multi: true,
    accept: ['.png', '.jpeg', '.jpg', '.gif'],
    onUpload(files) {

    }
})


