<template>
  <div>
    <!-- <ContentBar :PageTitle="title" /> -->
    <b-alert v-model="isSuccess" variant="success">{{ message }}</b-alert>
    <b-alert v-model="isError" variant="danger">{{ message }}</b-alert>

    <b-form @submit.prevent="onSave">
      <CCard>
        <CCardBody>
          <b-form-select
            @change="handleSelection"
            :options="roles"
            v-model="role.id"
          ></b-form-select>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <Loader class="mb-2" :isBusy="isBusy" />
          <table class="table border">
            <thead>
              <tr>
                <th>Menu Name</th>
                <th>Read</th>
                <th>Write</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(menu, m) in menus" :key="m">
                <td>{{ menu.name }}</td>
                <td>
                  <b-form-checkbox
                    v-model="menu.permission.read"
                  ></b-form-checkbox>
                </td>
                <td>
                  <b-form-checkbox
                    v-model="menu.permission.write"
                  ></b-form-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row mt-2 mb-2" v-if="menus.length > 0">
            <div class="col-md-2 d-flex justify-content-between">
              <b-button type="submit" variant="info" :disabled="isBusy"
                ><CIcon name="cil-check-circle" /> Submit</b-button
              >
              <!-- <b-button type="reset" class="ml-4" variant="danger" :disabled="isBusy">Cancel</b-button> -->
            </div>
          </div>
        </CCardBody>
      </CCard>
    </b-form>
  </div>
</template>
<script>
import { MenuService, RolePermissionService } from "@/services";

export default {
  data() {
    return {
      title: "Role and Permission",
      role: { id: null },
      roles: [],
      menus: [],
      permittedMenus: [],
    };
  },
  computed: {
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
  mounted() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      new RolePermissionService().getRoles().then((results) => {
        this.roles.push({ value: null, text: "Select Role" });
        results.map((r) => {
          this.roles.push({ value: r.name, text: r.name });
        });
      });
    },
    async handleSelection() {
      this.$store.commit("clearMessage");
      this.menus = [];
      this.permittedMenus = [];
      if (this.role.id == null) {
        return;
      }
      this.$store.commit("start");
      const roleWiseMenus = await MenuService.getMenus(this.role.id);
      roleWiseMenus.map((m) => {
        this.permittedMenus.push({
          id: m.id,
          permission: {
            role: this.role.id,
            id: m.permissions[0].id,
            read: m.permissions[0].read,
            write: m.permissions[0].write,
          },
        });
      });
      const result = await MenuService.getAllMenus();

      result.map((m) => {
        const permittedMenus = this.permittedMenus.filter(
          (pm) => pm.id == m.id
        );

        this.menus.push({
          name: m.name,
          id: m.id,
          permission: {
            role: this.role.id,
            menu: { id: m.id },
            id: permittedMenus[0] ? permittedMenus[0].permission.id : null,
            read: permittedMenus[0] ? permittedMenus[0].permission.read : false,
            write: permittedMenus[0]
              ? permittedMenus[0].permission.write
              : false,
          },
        });
      });

      this.$store.commit("finish");
    },
    onSave() {
      const payload = { permissions: [] };
      this.menus.map((m) => {
        payload.permissions.push(m.permission);
      });

      this.$store.commit("start");
      new RolePermissionService().saveRolePermission(payload).then((result) => {
        if (result.status == 200) {
          this.handleSelection();
          this.$store.commit("setSuccessMsg", result.data.message);
          window.scrollTo(0, 0);
        }
        this.$store.commit("finish");
      });
    },
  },
};
</script>