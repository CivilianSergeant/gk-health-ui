<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>
    <cCard>
      <CCardBody>
        <div class="row">
          <div class="col-md-5">
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="2"
              label-align-sm="right"
              label-size="sm"
              class="my-2"
            >
              <b-input-group>
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>

                <b-input-group-append>
                  <b-button :disabled="!filter" @click="filter = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
          <div class="col-md-7 text-right">
            <!-- All Medicines -->
            <router-link to="/medicines/add" class="btn btn-primary btn-sm my-3"
              >Add Medicine</router-link
            >
          </div>
        </div>
      </CCardBody>
    </cCard>

    <CCard>
      <CCardHeader> Medicines</CCardHeader>
      <CCardBody>
        <b-table
          id="medicine-table"
          :fields="fields"
          @filtered="onFiltered"
          :per-page="perPage"
          :busy.sync="isBusy"
          :filter="filter"
          :filter-included-fields="filterOn"
          :current-page="currentPage"
          :items="medicines"
        >
          <template #cell(active)="row">
            <span v-if="row.item.active" class="badge badge-success"
              >Active
            </span>
            <span v-if="!row.item.active" class="badge badge-danger"
              >Inactive
            </span>
          </template>
          <template #cell(action)="row">
            <router-link
              class="btn btn-primary btn-sm"
              :to="'/medicines/' + row.item.id + '/detail'"
              >Edit</router-link
            >
          </template>
        </b-table>
      </CCardBody>
    </CCard>
    <Loader :isBusy="isBusy" />
  </div>
</template>
<script>
import { MedicineService } from "@/services";

export default {
  computed: {
    rows() {
      return this.totalRows; //this.services.length
    },
    isBusy() {
      return this.$store.state.isBusy;
    },
    isError() {
      return this.$store.state.isError;
    },
    isSuccess() {
      return this.$store.state.isSuccess;
    },
    message() {
      return this.$store.state.message;
    },
  },
  data() {
    return {
      title: "Medicines",
      fields: [
        "name",
        { key: "medicineBrand.name", label: "Medicine Brand" },
        { key: "medicineGroup.name", label: "Medicine Group" },
        "active",
        "action",
      ],
      perPage: 20,
      currentPage: 1,
      medicines: [],
      medicineGroups: [],
      medicineBrands: [],
      form: {
        name: "",
        active: true,
        medicineGroup: { id: null },
        medicineBrand: { id: null },
      },
      filter: null,
      filterOn: [],
      totalRows: 0,
    };
  },
  mounted() {
    this.fetcheMedicines();
  },
  methods: {
    fetcheMedicines() {
      this.$store.commit("start");
      new MedicineService().getMedicines().then((result) => {
        this.medicines = result;
        this.totalRows = this.medicines.length;
        this.$store.commit("finish");
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>