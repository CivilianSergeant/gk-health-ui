<template>
    <div>
    <b-form class="container-fluid mt-2" id="uploaderFrm">
        <div class="large-12 medium-12 small-12 cell">
            <label>
                <div class="large-12 medium-12 small-12 cell">
                    <button type="button" :disabled="disable" class="btn btn-info btn-sm" v-on:click="addFiles()">{{btnCaption? btnCaption:'Browse File'}}</button>
                </div>
                <input type="file" id="file" ref="mfile" :accept="accept" multiple v-on:change="handleFileUpload()"/>
                <em>File Type (.{{allowedFileExt}})</em>
            </label>
            <p class="text-danger" v-if="errorMessage">{{errorMessage}}</p>   
        </div>
    </b-form>
    <div class="container-fluid d-table">
        <table class="table table-borderd">
            <tbody>
                <tr v-for="(file,index) in files" :key="index" >
                    <td class="position-relative" >
                        <div class="d-flex flex-row justify-content-between">
                            <div class="d-flex flex-column col-md-2">
                                <img v-show="file.isPPT" class="pull-left mb-2 mr-1" src=""/>
                                <img v-show="file.isXLS" class="pull-left mb-2 mr-1" src=""/>
                                <img v-show="file.isDOC" class="pull-left mb-2 mr-1" src=""/>
                                <img v-show="file.isPDF" class="pull-left mb-2 mr-1" src=""/>
                                <img v-show="file.isIMG" class="pull-left mb-2 mr-1" :ref="'file-'+index" src="" />
                                <span class="d-block">{{file.name}}</span>
                                <span class="text-danger ml-1" v-if="file.errorMessage">{{file.errorMessage}}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <progress max="100" :ref="'file-progress-'+index" value="0" ></progress>
                            </div>
                            
                            
                            <div class="d-flex align-items-center">
                                <button v-if="file.uploadFlag"  type="button" class="btn btn-success btn-sm pull-right" @click="uploadFile(index)" >Upload</button>
                                <button v-if="file.uploadFlag" type="button" class="btn btn-danger btn-sm pull-right  ml-1" @click="removeFile(index)" >X</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr/>
        <button v-if="isShowUploadAll && files.length" type="button" class="btn btn-info btn-sm pull-right" :disabled="disableUploadAll()" v-on:click="submitFile()">Upload All</button>
    </div>
    </div>
</template>
<script lang="ts" src="./UploaderUiController.ts"></script>

<style scopped>
input[type="file"]{
    position: absolute;
    top: -500px;
}
img{
                width:100px;
                padding:4px;
                border:1px solid #aaa;
            }
</style>
