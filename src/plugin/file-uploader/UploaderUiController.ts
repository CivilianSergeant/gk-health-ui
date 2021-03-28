import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class UploaderUi extends Vue {

    get name(){
        return 'UploaderUi';
    }

    

    @Prop() allowedFileType!: string;
    @Prop() allowedFileExt!: string;
    @Prop() accept!: string;
    @Prop() isShowUploadAll!: boolean;
    @Prop() disable!: boolean;
    @Prop() uploadUrl!: string;
    @Prop() btnCaption!: string;
    

    private title="File Uploader";
    private file=null;
    private maxFileSize=5;
    private files: string[]=[];
    
    private uploaderObject=null;
    private reader!: any;
    uploadAllClicked=false;
    private errorMessage = "";
    private header: Record<any,any> = {
        headers: {'Content-Type': 'multipart/form-data'}
    }

    @Watch('disable')
    DisableUploader(old: string, newVal: string){
       
        return (this.disable)? true : false;
        
    }

    addFiles(){
        const _file: any = this.$refs.mfile;
        _file.click();
    }

    clearMessage(){
        this.errorMessage = '';
    }
    disableUploadAll(){
        return this.uploadAllClicked;
    }

    renderThumbnail(file: Record<string,any>){
        if(file.type.match('image') != null){

            file.isIMG = true;
            file.isPDF = false;
            file.isDOC = false;
            file.isXLS = false;
            file.isPPT = false;
        }
        if(file.type.match('pdf') != null){
            file.isIMG = false;
            file.isPDF = true;
            file.isDOC = false;
            file.isXLS = false;
            file.isPPT = false;
        }
        if(file.type.match('wordprocessingml') != null){
            file.isIMG = false;
            file.isPDF = false;
            file.isDOC = true;
            file.isXLS = false;
            file.isPPT = false;
        }
        if(file.type.match('spreadsheetml') != null){
            file.isIMG = false;
            file.isPDF = false;
            file.isDOC = false;
            file.isXLS = true;
            file.isPPT = false;
        }
        if(file.type.match('presentationml') != null){
            file.isIMG = false;
            file.isPDF = false;
            file.isDOC = false;
            file.isXLS = false;
            file.isPPT = true;
        }
    }

    handleOnFileReader(reader: FileReader,index: number){
        setTimeout(()=>{
            const refs: any = this.$refs['file-'+index];
            if(this.files[index] != undefined){
                const _file: any = this.files[index];
                _file.src=reader.result;
                if(_file.isIMG){
                    refs[0].src=_file.src;
                }
            }
        },250);
    }

    handleFileUpload(){
        this.clearMessage();
        this.uploadAllClicked=false;
        const input: any = this.$refs.mfile;
        for(const f in input.files){
            const fileObj = input.files[f];
            let count = this.files.length;
            count = (count<0)? 0: count;
            
            if(typeof fileObj == 'object'){
                
                this.reader =  new FileReader();
                this.reader.onload = this.handleOnFileReader(this.reader,count);
                fileObj.uploadPercentage = 0;
                if(fileObj.size >= (this.maxFileSize*1024*1024)){
                    const fileSize = Math.round(fileObj.size/(1024*1024))
                    fileObj.errorMessage = 'Maximum File Size '+this.maxFileSize+'Mb, Your file size is :'+fileSize+'Mb';
                    
                    fileObj.uploadFlag=false;
                }
                
                if(this._checkFileType(fileObj,this.allowedFileType)){
                    fileObj.uploadFlag=true;
                    this.files.push(fileObj);
                    this.reader.readAsDataURL(fileObj);
                    this.renderThumbnail(fileObj);
                    this.errorMessage = '';
                }else{
                    this.errorMessage = 'File type not matched';
                }
                
            }
        }
    }

    _checkFileType (file: Record<string,any>,allowedType: string){
        let allowedTypeFlag = false;
        
        const allowedTypes = allowedType.split(',');
        if(typeof allowedTypes == "string"){
            allowedTypeFlag = (allowedTypes == file['type'])? true : false; 
        }else{
            for(const f in allowedTypes){
                if(allowedTypes[f] == file['type']){
                    allowedTypeFlag = true;
                    this.header.headers['allowedFileType'] = allowedType;
                    break;
                }
            }
        }
        
        return allowedTypeFlag;
    }
    refreshPreview(){
        
        for(const i in this.files){
            const refs: any = this.$refs['file-'+i];
            const file: any = this.files[i];
            refs[0].src=file.src;
        }
    }

    removeFile(index: number){
        this.files.splice(index,1);
        // if(this.files.length==0){
        this.reset();
           
        // }
        this.refreshPreview();
    }

    reset(){
        const uploaderForm: any = document.getElementById("uploaderFrm");
        if(uploaderForm != null){
            uploaderForm.reset();
            this.files=[];
        }
    }

    uploadFile(index: number){
        const file: any =this.files[index];
        const formData = new FormData();
        formData.append('file', file);
        
        // console.log(file.uploadPercentage);
        if(file.uploadPercentage != undefined && file.uploadPercentage>0){
            return;
        }
        axios.post(this.uploadUrl,formData,{
            headers: {'Allowed-File-Types':this.allowedFileType,'Content-Type': 'multipart/form-data'},
            onUploadProgress:( progressEvent: ProgressEvent )=> {
                const file: any = this.files[index];
                const refs: any = this.$refs['file-progress-'+index];
                file.uploadPercentage =  Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) ;
                if(file.uploadPercentage==100){
                    file.uploadFlag=false;
                    this.$forceUpdate();
                    
                }
                refs[0].value=file.uploadPercentage;
                
            }
        }).then((res: Record<string,any>) =>{
            const file: any = this.files[index];
            if(res.status != 200){
                file.errorMessage = res.data.message;  
                this.$forceUpdate();
            }else if(res.status==200){
                
                this.$emit('uploadedfile',res.data);
                // if(window.uploadedFiles == undefined){
                //     window.uploadedFiles = [];
                // }
                
                // store uploaded data
                // window.uploadedFiles.push(res.data.uploaded);
                // window.parent.ProcessChildWindow(this.uploaderObject,res.data.uploaded);
            }
        }).catch((error: Record<string,any>)=>{
            console.log(error)
        });
        
    }
}