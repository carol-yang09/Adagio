<template>
  <div>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{'disabled': pagination.current_page === 1}">
          <a class="page-link" href="#" aria-label="Previous"
           @click.prevent="changePage(pagination.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" :class="{'active': n === pagination.current_page}"
         v-for="n in pagination.total_pages" :key="n">
          <a class="page-link" href="#" @click.prevent="changePage(n)">
            {{ n }}
          </a>
        </li>
        <li class="page-item"
         :class="{'disabled': pagination.current_page === pagination.total_pages}">
          <a class="page-link" href="#" aria-label="Next"
           @click.prevent="changePage(pagination.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  methods: {
    changePage(page) {
      this.$emit('get-data', page);
    },
  },
  computed: {
    ...mapGetters('paginationModules', ['pagination']),
  },
};
</script>
