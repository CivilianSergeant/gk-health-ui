<template>
    <div>
        <CCard>
            <CCardHeader>Add Village <router-link
          to="/villages"
          class="btn btn-primary btn-sm float-right"
          >Village List</router-link
        ></CCardHeader>
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <CCardBody>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Division: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                    
                    <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> District: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Upazila: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Uniion: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                        <div class="col-md-4">
                        <b-form-group
                            id="input-group-1"
                            label-for="input-1"
                            description=""
                        >
                            <label> Village: <span class="text-danger">*</span></label>
                            <b-form-select
                            required
                            id="divisions"
                            ></b-form-select>
                        </b-form-group>
                        </div>
                    </div>
            </CCardBody>
            <CCardFooter>
                 <div class="row mt-2 mb-2">
            <div class="col-md-3 d-flex justify-content-between">
              <b-button type="submit" variant="info"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <b-button type="reset" class="ml-2" variant="danger">
                <CIcon name="cil-x-circle" /> Cancel</b-button
              >
            </div>
          </div>
            </CCardFooter>
        </b-form>
        </CCard>
    </div>
</template>