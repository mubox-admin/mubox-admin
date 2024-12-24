import { ref } from "vue";

export const enum DrawerPage {
  Add = "新增",
  Detail = "详情",
}

export function useDrawer() {
  const currentDrawer = ref(DrawerPage.Detail);
  const showDrawer = ref(false);
  const currentRow = ref();
  function showAdd() {
    showDrawer.value = true;
    currentDrawer.value = DrawerPage.Add;
  }
  function showDetail(row) {
    showDrawer.value = true;
    currentDrawer.value = DrawerPage.Detail;
    currentRow.value = row;
  }
  return {
    currentDrawer,
    showDrawer,
    currentRow,
    showAdd,
    showDetail,
  };
}
