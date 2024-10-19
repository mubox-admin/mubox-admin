<script setup lang='ts'>
import { ArrowDown, ArrowUp } from "@vicons/ionicons5";
import type { TableColumns } from "naive-ui/es/data-table/src/interface";
import { clone } from "@mubox/utils";

interface Pagination {
  current: number;
  size: number;
}

interface SearchDataStruct {
  records: any[];
  total: number;
}

const props = defineProps<{
  tableColumns: TableColumns;
  searchRequest: (pagination: Pagination) => SearchDataStruct | Promise<SearchDataStruct>;
}>();
const { searchRequest } = props;

// 表单数据，用于重置
const formData = defineModel("formData");

const showContent = ref(false);

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
});
const loading = ref(false);

const tableData = ref<any[]>([]);
async function search() {
  const { records, total }: SearchDataStruct = await searchRequest({
    current: pagination.value.page,
    size: pagination.value.pageSize,
  });
  tableData.value = records;
  pagination.value.itemCount = total;
}
function handlePageChange(currentPage) {
  pagination.value.page = currentPage;
  search();
}

const originalFormData = clone(formData.value);
function resetFormData() {
  formData.value = clone(originalFormData);
};

defineExpose({
  handlePageChange,
});
</script>

<template>
  <div class="search">
    <div class="search-container">
      <n-form class="search-form" :class="{ 'search-form--shrink': showContent }" :label-width="80">
        <slot name="search-form" />
      </n-form>
      <div class="search-form-control" :class="{ 'search-form-control--shrink': showContent }">
        <n-button type="primary" @click="handlePageChange(1)">
          查询
        </n-button>
        <n-button @click="resetFormData">
          重置
        </n-button>
        <n-button quaternary @click="showContent = !showContent">
          <template #icon>
            <n-icon>
              <ArrowUp v-if="showContent" />
              <ArrowDown v-else />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <div class="search-table-container">
      <div class="search-buttons">
        <div class="search-button__left">
          <slot name="search-function-left" />
        </div>
        <div class="search-button__right">
          <slot name="search-function-right" />
        </div>
      </div>
      <n-data-table
        class="search-table"
        flex-height
        remote
        :loading="loading"
        :columns="tableColumns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang='scss' scoped>
@use "@/style/mixin/scrollbar";

.search {
  height: calc(100vh - 111px);
}

.search-container {
  position: relative;
  width: 100%;
  height: 92px;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background-color: var(--n-color);
  position: absolute;
  width: calc(100% - 24px);
  padding: 12px;
  border-radius: 8px;
  height: 72px;
  overflow: hidden;
  z-index: 10;
  transition: 0.3s;
  max-height: 84px * 6;
  gap: 0 10px;

  // 表单滚动条相关
  @include scrollbar.form-scrollbar;
  // 点击展开
  &--shrink {
    position: relative;
    height: auto;
    overflow-y: auto;
    border-radius: 8px 8px 0 0;
  }
}

.search-form-control {
  width: 20%;
  height: 100%;
  position: absolute;
  z-index: 20;
  background-color: var(--n-color);
  right: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  box-sizing: border-box;
  padding-top: 18px;
  padding-right: 32px;
  border-radius: 8px;
  &--shrink {
    width: 100%;
    height: auto;
    position: relative;
    justify-content: flex-end;
    padding-top: 0;
    padding-bottom: 8px;
    box-shadow: 0 8px 10px -8px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 8px 8px;
  }
}

.search-table-container {
  height: calc(100% - 124px);
  margin-top: 16px;
  background-color: var(--n-color);
  border-radius: 10px;
  padding: 4px 12px 12px;
  .search-buttons {
    display: flex;
    justify-content: space-between;
    height: 50px;
    .search-button__left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-button__right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  .search-table {
    height: calc(100% - 52px);
    overflow: auto;
  }
}
</style>
