<template>
  <div>
    <CCard>
      <CCardHeader>
        Doctor Camp List
        <router-link
          to="/doctor-camp/add"
          class="btn btn-primary btn-sm float-right"
          >Add Doctor Camp</router-link
        ></CCardHeader
      >
      <CCardBody>
        <div class="table-responsive">
          <b-table class="position-relative"></b-table>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>