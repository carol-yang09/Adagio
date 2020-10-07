<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="true"></loading>

    <div class="mb-4 text-right">
      <button type="button" class="btn btn-dark" @click.prevent="openModal('create')">
        新增產品
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col" class="d-none d-md-table-cell">分類</th>
            <th scope="col" class="d-none d-lg-table-cell">縮圖</th>
            <th scope="col">產品名稱</th>
            <th scope="col" class="d-none d-lg-table-cell">原價</th>
            <th scope="col" class="d-none d-sm-table-cell">售價</th>
            <th scope="col" class="d-none d-sm-table-cell">是否啟用</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody v-if="products.length">
          <tr v-for="item in products" :key="item.id">
            <td class="d-none d-md-table-cell align-middle">{{ item.category }}</td>
            <td class="d-none d-lg-table-cell">
              <span class="thumbnail"
               :style="{backgroundImage: 'url(' + item.imageUrl[0] + ')'}"></span>
            </td>
            <td class="align-middle">{{ item.title }}</td>
            <td class="d-none d-lg-table-cell align-middle text-right">
              {{ item.origin_price | currency }}
            </td>
            <td class="d-none d-sm-table-cell align-middle text-right">
              {{ item.price | currency }}
            </td>
            <td class="d-none d-sm-table-cell align-middle">
              <span class="text-success" v-if="item.enabled">啟用</span>
              <span class="text-muted" v-else>未啟用</span>
            </td>
            <td class="align-middle">
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-dark"
                 @click.prevent="openModal('update', item)">
                  編輯
                </button>
                <button type="button" class="btn btn-outline-danger"
                 @click.prevent="openModal('del', item)">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- editModal -->
    <div class="modal fade" id="editModal" role="dialog" aria-labelledby="editModalTitle"
     aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title" id="editModalTitle">
              {{ status === 'create' ? '新增產品' : '更新產品' }}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group" v-for="i in 5" :key="i">
                    <label :for="'imageUrl' + i">圖片網址：</label>
                    <input type="text" :id="'imageUrl' + i" class="form-control"
                     placeholder="請輸入圖片網址" v-model="tempProduct.imageUrl[i-1]" required>
                  </div>
                  <div class="form-group">
                    <p class="mb-2">上傳檔案(不可超過 2 MB)</p>
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" id="file" accept="image/*"
                       ref="file" @change="uploadFile">
                      <label class="custom-file-label" for="file">選擇檔案</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="form-group">
                    <label for="title">標題：</label>
                    <input type="text" id="title" class="form-control" placeholder="請輸入標題"
                     v-model="tempProduct.title" required>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="category">分類：</label>
                      <input type="text" id="category" class="form-control" placeholder="請輸入分類"
                       v-model="tempProduct.category" required>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="unit">單位：</label>
                      <input type="text" id="unit" class="form-control" placeholder="請輸入單位"
                       v-model="tempProduct.unit" required>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="origin_price">原價：</label>
                      <input type="number" id="origin_price" class="form-control"
                       placeholder="請輸入原價" v-model="tempProduct.origin_price" required>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="price">售價：</label>
                      <input type="number" id="price" class="form-control" placeholder="請輸入售價"
                       v-model="tempProduct.price" required>
                    </div>
                  </div>
                  <hr>
                  <div class="form-group" v-if="tempProduct.options">
                    <label for="ingredient">產品成分：</label>
                    <textarea class="form-control" id="ingredient" rows="3" placeholder="請輸入產品成分"
                     v-model="tempProduct.options.ingredient" require></textarea>
                  </div>
                  <div class="form-group">
                    <label for="content">產品介紹：</label>
                    <textarea class="form-control" id="content" rows="3" placeholder="請輸入產品介紹"
                     v-model="tempProduct.content" require></textarea>
                  </div>
                  <div class="form-group">
                    <label for="description">產品描述：</label>
                    <vue-editor id="description" v-model="tempProduct.description"
                     placeholder="請輸入產品描述"/>
                  </div>
                  <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="enabled"
                    v-model="tempProduct.enabled" :true-value="true" :false-value="false">
                    <label class="form-check-label" for="enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="submit" class="btn btn-dark" @click.prevent="updateProduct()">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delModal -->
    <div class="modal fade" id="delModal" role="dialog" aria-labelledby="delModalTitle"
     aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-light">
            <h5 class="modal-title" id="delModalTitle">刪除產品</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            確定要刪除該筆產品 (刪除後無法復原)
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-outline-danger"
             @click.prevent="delProduct()">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <Pagination :pages="pagination" @get-data="getProducts"/>
  </div>
</template>

<script>
/* global $ */
import { VueEditor } from 'vue2-editor';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'ProductsManage',
  props: ['token'],
  data() {
    return {
      isLoading: false,
      pagination: {},
      products: {},
      tempProduct: {
        imageUrl: [],
        options: {
          ingredient: '',
        },
      },
      status: '',
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/products?page=${page}&paged=10`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.products = res.data.data;
        vm.pagination = res.data.meta.pagination;
        vm.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${id}`;
      vm.isLoading = true;
      vm.$http.get(url).then((res) => {
        vm.tempProduct = res.data.data;
        $('#editModal').modal('show');
        vm.isLoading = false;
      }).catch(() => {
        $('#editModal').modal('hide');
        vm.isLoading = false;
        const msg = {
          icon: 'error',
          title: '載入產品失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
    openModal(status, item) {
      this.status = '';
      switch (status) {
        case 'del':
          $('#delModal').modal('show');
          this.tempProduct = { ...item };
          break;
        case 'update':
          this.getProduct(item.id);
          this.status = 'update';
          break;
        case 'create':
          $('#editModal').modal('show');
          this.tempProduct = {
            imageUrl: [],
            options: {
              ingredient: '',
            },
          };
          this.status = 'create';
          break;
        default:
          break;
      }
    },
    updateProduct() {
      const vm = this;
      let status = '新增';
      let method = 'post';
      let url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product`;
      if (vm.status === 'update') {
        method = 'patch';
        url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${vm.tempProduct.id}`;
        status = '更新';
      }
      vm.isLoading = true;
      vm.$http[method](url, vm.tempProduct).then(() => {
        vm.isLoading = false;
        vm.getProducts();
        $('#editModal').modal('hide');
        const msg = {
          icon: 'success',
          title: `${status}產品成功`,
        };
        vm.$bus.$emit('alertmessage', msg);
      }).catch(() => {
        $('#editModal').modal('hide');
        vm.isLoading = false;
        const msg = {
          icon: 'error',
          title: `${status}產品失敗`,
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
    delProduct() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/ec/product/${vm.tempProduct.id}`;
      vm.isLoading = true;
      vm.$http.delete(url).then(() => {
        vm.isLoading = false;
        vm.getProducts();
        $('#delModal').modal('hide');
        const msg = {
          icon: 'success',
          title: '刪除產品成功',
        };
        vm.$bus.$emit('alertmessage', msg);
      }).catch(() => {
        vm.isLoading = false;
        const msg = {
          icon: 'error',
          title: '刪除產品失敗',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
      $('#delModal').modal('hide');
    },
    uploadFile() {
      const vm = this;
      const file = vm.$refs.file.files[0];
      const formData = new FormData();
      formData.append('file', file);
      vm.isLoading = true;
      const url = `${process.env.VUE_APP_APIPATH}/${process.env.VUE_APP_UUID}/admin/storage`;
      vm.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        if (res.status === 200) {
          // 清空空白圖片網址
          const array = vm.tempProduct.imageUrl.filter((item) => item !== null);
          array.push(res.data.data.path);
          vm.tempProduct.imageUrl = array;
        }
        vm.isLoading = false;
        const msg = {
          icon: 'success',
          title: '上傳圖檔成功',
        };
        vm.$bus.$emit('alertmessage', msg);
      }).catch(() => {
        vm.isLoading = false;
        const msg = {
          icon: 'error',
          title: '上傳圖檔失敗，請確認檔案大小',
        };
        vm.$bus.$emit('alertmessage', msg);
      });
    },
  },
  components: {
    VueEditor,
    Pagination,
  },
  created() {
    this.getProducts();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all';

.thumbnail {
  display: inline-block;
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
