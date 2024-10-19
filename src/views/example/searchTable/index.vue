<script setup lang="tsx">
import { CloudUploadOutline } from "@vicons/ionicons5";
import type { UploadCustomRequestOptions } from "naive-ui";
import { fetchInventoryImport } from "./api";
import { colorOptions, itemTypesOptions } from "@/constants/options";
import { dialog, message } from "@/utils/discreteApi";

defineOptions({
  name: "SearchTableExample",
});

const formData = ref({
  categoryType: "",
  color: "",
  itemCode: "",
  itemName: "",
  locationCode: "",
  storageCondition: "",
  mgtDate: null,
});

const columns = [
  {
    title: "库位编码",
    key: "locationCode",
  },
  {
    title: "商品编码",
    key: "itemCode",
  },
  {
    title: "商品名称",
    key: "itemName",
  },

  {
    title: "商品分类",
    key: "categoryType",
  },
  {
    title: "颜色",
    key: "color",
  },
  {
    title: "生产日期",
    key: "mgtDate",
    width: 150,
  },
  {
    title: "创建时间",
    key: "createTime",
    width: 200,
  },
  {
    title: "更新时间",
    key: "modifyTime",
    width: 200,
  },
];

const showImportStorageModel = ref(false);

function search() {
  // 调用接口
  // await xxxRequest()
  return {
    records: columns.map(item => ({
      [item.key]: "cool",
    })),
    total: 100,
  };
}

async function importStorage({ file }: UploadCustomRequestOptions) {
  if (!file.file)
    return;
  const { data } = await fetchInventoryImport(file.file);
  const { code, data: result, message: msg } = data;
  if (code !== "0") {
    message.error(msg);
    return;
  }
  const { successCount, failCount, failList } = result;
  showImportStorageModel.value = false;
  dialog.info({
    title: () => (
      <n-space>
        上传结果
        {failCount === 0
          ? (
              <n-tag type="success">
                成功
                {successCount}
                条
              </n-tag>
            )
          : (
              ""
            )}
        <n-tag type="error">
          失败
          {failCount}
          条
        </n-tag>
      </n-space>
    ),
    content: () =>
      failList.length
        ? (
            <div>
              <h3 style="margin-top: 12px">失败原因</h3>
              <n-list bordered>
                {failList.map((info) => {
                  return <n-list-item>{info}</n-list-item>;
                })}
              </n-list>
            </div>
          )
        : (
            ""
          ),
    positiveText: "确定",
  });
}
</script>

<template>
  <m-search-table v-model:form-data="formData" :table-columns="columns" :search-request="search">
    <template #search-form>
      <n-form-item label="商品名称">
        <n-input v-model:value="formData.itemName" />
      </n-form-item>
      <n-form-item label="商品类目">
        <n-select
          v-model:value="formData.categoryType"
          :options="itemTypesOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="颜色">
        <n-select
          v-model:value="formData.color"
          :options="colorOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="库位编码">
        <n-input v-model:value="formData.locationCode" />
      </n-form-item>
      <n-form-item label="生产日期">
        <n-date-picker v-model:value="formData.mgtDate" type="date" clearable />
      </n-form-item>
    </template>
    <template #search-function-left>
      <n-button type="success" @click="showImportStorageModel = true">
        导入
      </n-button>
    </template>
  </m-search-table>
  <!-- 导入弹窗 -->
  <n-modal v-model:show="showImportStorageModel" style="width: 500px">
    <div style="padding: 10px; background-color: #fff">
      <n-upload
        name="fileKeyName"
        directory-dnd
        :custom-request="importStorage"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" depth="3">
              <CloudUploadOutline />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
        </n-upload-dragger>
      </n-upload>
    </div>
  </n-modal>
</template>
