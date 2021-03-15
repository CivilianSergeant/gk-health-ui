import UploderUi from './UploaderUi.vue'

const FileUploder = {
    install(Vue: any, option: any){
        Vue.component('uploder-ui',UploderUi)
        
        
    }
}

export default FileUploder;