<template>
  <div>
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{'disabled': pages.current_page === 1}">
          <a class="page-link" href="#" aria-label="Previous"
           @click.prevent="changePage(pages.current_page - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" :class="{'active': n === pages.current_page}"
         v-for="n in pages.total_pages" :key="n">
          <a class="page-link" href="#" @click.prevent="changePage(n)">
            {{ n }}
          </a>
        </li>
        <li class="page-item" :class="{'disabled': pages.current_page === pages.total_pages}">
          <a class="page-link" href="#" aria-label="Next"
           @click.prevent="changePage(pages.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['pages'],
  methods: {
    changePage(page) {
      this.$emit('get-data', page);
    },
  },
};
</script>
