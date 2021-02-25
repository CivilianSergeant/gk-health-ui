<template>
    <div>
        <ContentBar :PageTitle="title"/>
        <b-alert v-model="isSuccess" variant="success">{{message}}</b-alert>
        <b-alert v-model="isError" variant="danger">{{message}}</b-alert>
        <h5>Service Attributes
      
        <router-link to="/services" class=" btn btn-info btn-sm float-right">Service List</router-link >
        <router-link :to="'/services/'+form.serviceId+'/attribute'" class=" btn btn-info btn-sm float-right">Service Attributes</router-link >

        </h5>
    </div>
</template>
