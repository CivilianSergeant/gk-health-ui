<template>
    <div class="autocomplete">
        <textarea v-if="textarea" :id="id" :rows="rows" :cols="cols" class="autocomplete-input" 
            :placeholder="placeholder" @focusout="focusout" 
            @focus="focus" @keydown.13="chooseItem" @keydown.tab="chooseItem" 
            @keydown.40="moveDown" @keydown.38="moveUp" v-model="inputValue" type="text"></textarea>
		<div v-else class="input-group">
            <input  :id="id" class="form-control autocomplete-input input-sm" 
            :disabled="(!ajax && items.length==0) || (disabled!=undefined && disabled)" :placeholder="placeholder" @blur="hideResult" 
            @focus="displayResult"  @keydown.13="chooseItem" @keydown.tab="chooseItem" 
            @keydown.40="moveDown" @keydown.38="moveUp" @input="typing" v-model="inputValue" 
            type="text" :required="required" autocomplete="off"  />
        <!-- <div class="input-group-append" v-if="showAddBtn">
            <button class="btn btn-secondary btn-sm" @click="saveItem" type="button">
                <i class="icon-plus"></i>
            </button>
        </div> -->
    </div>
    <!-- <span v-if="errorMessage" class="text-danger">{{errorMessage}}</span>
    <span v-if="successMessage" class="text-success">{{successMessage}}</span> -->
    <ul :class="{'autocomplete-list': true,[id+'-list']: true}" v-if="showResult">
		<li :class="{active: selectedIndex === index}" v-for="(result, index) in searchMatch" :key="index" @click="selectItem(index)">
		{{result[label]}}
        </li>
    </ul>{{loadItem}}
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class Autocomplete extends Vue {

    @Prop() items!: any;

	@Prop()rowIndex!: number;
	
	@Prop() ajax!: boolean;

    @Prop()compairingIndex!: number; 
    @Prop()item!: any;
    @Prop()itemId!: number; 
    @Prop()placeholder!: string;
    @Prop()label!: string;
    @Prop()textarea!: string;
    @Prop()required!: string;
    @Prop()disabled!: boolean;
    // @Prop()rows!: number;

    // required", "addItem", , "label", "textarea", "rows", "cols"

    
    private id: string = 'input-' + Math.random() * 1000;
    private inputValue= "";
    private searchMatch: any;
    private standardItems: any = [];
    private selectedIndex= 0;
    private wordIndex=0;
    private showResult=false;
    private clickedChooseItem=false;

	get	listToSearch() {
			if (typeof this.items !== "undefined" && this.items.length > 0) {
				return this.items;
			} else {
				return this.standardItems;
			}
			
        }
        
	get	currentWord() {
			return this.inputValue.replace(/(\r\n|\n|\r)/gm, ' ').split('')[this.wordIndex];
        }
        
	get	loadItem(){
			for(const index in this.items){
				const id = (this.compairingIndex)? this.compairingIndex : 'id';

				if(this.item !=null){ 
					if(this.items[index][id] == this.item[this.itemId]){
						this.selectedIndex = parseInt(index);
						this.inputValue = this.items[index][this.label];
					}
				}
				
            }
            return "";
        }

		@Watch('items')
		onPropertyChanged(value: any, oldValue: any){
			this.showResult = true;
			this.focus();
		}
        
        typing(){
			//console.log(this.inputValue.length);
			if(this.inputValue.length==0){
				this.$emit('clearitem');
			}

			if(this.inputValue.length>=0){
				this.focus();
				this.showResult=true;
			}

			if(this.ajax==true){
				this.$emit('ajax-call',this.inputValue,this)
			}
			
		}
		highlightWord(word: any) {
			return (this.label)? word[this.label] : word.name; 
		}
		moveDown() {
			if (this.selectedIndex < this.searchMatch.length - 1) {
                this.selectedIndex++;
			}
		}
		moveUp() {
			if (this.selectedIndex !== -1) {
				this.selectedIndex--;
			}
		}
		selectItem(index: any) {
			this.selectedIndex = index;
			const _index = (this.label)? this.label : 'name';
			this.inputValue = this.searchMatch[this.selectedIndex][_index];
			this.$emit('choose-item',this.searchMatch[this.selectedIndex],this,index,this.rowIndex);
			this.showResult = false;
			this.focusout(null);

		}
		chooseItem(e: any) {

			if(e){
				e.preventDefault();
			}
			
			if (this.searchMatch[this.selectedIndex] != undefined) {
				const index = (this.label)? this.label : 'name';
				this.inputValue = this.searchMatch[this.selectedIndex][index];
				this.showResult = false;
				this.$emit('choose-item',this.searchMatch[this.selectedIndex],this,this.selectedIndex);
				this.focusout(null);
				
			}
                                
			return false;
			
		}
		focusout(e: any): any {
			setTimeout(() => {
				if (!this.clickedChooseItem) {
					this.searchMatch = [];
					this.selectedIndex = -1;
				}
				this.clickedChooseItem = false;
				
			}, 100);
		}
		focus() {
			this.searchMatch = [];
			if (this.showResult == true && this.listToSearch != undefined) {
				this.searchMatch = this.listToSearch.filter(
					(el: any) => {
						const index = (this.label)? this.label : 'name';
						const pattern = new RegExp(/\\([a-z]|\d)/gi)
						if(pattern.test(this.inputValue.toString())){
							return false;
						}
						const text = this.inputValue.toString().replaceAll(new RegExp(/\(|\)/gi),'');
						
						if(this.inputValue != undefined){
							if(el[index].toString().toLowerCase().match(text.toLowerCase())){
								return el;
							}
						}
					}
				);

				// if(this.addItem != undefined){
				// 	if(this.searchMatch.length==0){
				// 		this.showAddBtn = true;
				// 	}else if(this.searchMatch.length>0){
				// 		this.showAddBtn = false;
				// 	}
				// }
			}
			if(this.inputValue == ""){
				this.searchMatch = this.listToSearch;
			}
		}
		hideResult(){
			setTimeout(() => {
			this.showResult = false;
			// if(this.addItem != undefined){
			// 	this.showAddBtn = false;
			// }
			},200);
		}
		displayResult(){
			this.showResult = true;
			this.focus();
        }
        
        setInputValue(val: any){
			this.inputValue = val;
		}
	
}

</script>

<style scoped>
 .autocomplete {
    position: relative;
}
.autocomplete .label {
    display: block;

    margin-bottom: 5px;

    font-size: 14px;
    font-weight: 100;
}

.autocomplete-input {
    padding: 7px 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    
}
.autocomplete-input:focus {
    border-color: #000;
}

.autocomplete-list {
    position: absolute;
    top:36px;
    z-index: 2;

    overflow: auto;

    min-width: 250px;
    max-height: 150px;
    margin: 0;
    margin-top: 5px;
    padding: 0;
    
    border: 1px solid #eee;

    list-style: none;

    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
    width:100%;
    
}
.autocomplete-list li {
    margin: 0;
    padding: 8px 15px;

    border-bottom: 1px solid #f5f5f5;
}

.autocomplete-list li:last-child {
    border-bottom: 0;
}
.autocomplete-list li:hover, .autocomplete-list li.active {
    background-color: #f5f5f5;
    cursor:pointer;
}
</style>
