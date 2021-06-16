<template>
  <div>
    
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
        <CCardHeader>
            Vouchers
            <router-link
            to="/vouchers/add"
            class="btn btn-primary btn-sm float-right"
            >Add Voucher</router-link
        ></CCardHeader>
        <CCardBody>
            
        </CCardBody>
    </cCard>

    </div>    
</template>
