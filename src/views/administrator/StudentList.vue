<!-- template内部只能有一个root标签,否则UseContent那里的transition、router-view会出bug, 所以要用div包起来 -->
<template>
  <white-background :loading="loading">
    <a-row class="header">
      <a-col :span="18"></a-col>
      <a-col :span="6">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          添加学生
        </a-button>
      </a-col>
    </a-row>
    <div v-if="!loading">
      <a-table
        class="table"
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
      >
        <template #operation="{ record }">
          <div>
            <span>
              <a class="operation-text" @click.stop="handleModify(record)">
                修改
              </a>
              <a-popconfirm
                title="确定要删除吗?"
                okText="确定"
                cancelText="取消"
                @confirm="handleDelete(record)"
              >
                <a class="operation-text">删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>

    <a-modal
      :title="modalTitle"
      v-model:visible="modalVisible"
      @ok="handleModalConfirm"
    >
      <a-form
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="姓名">
          <a-input v-model:value="form.name" name="name" />
        </a-form-item>
        <a-form-item label="年龄" name="age">
          <a-input v-model:value="form.age" />
        </a-form-item>
        <a-form-item label="生日" name="birthday">
          <a-input v-model:value="form.birthday" />
        </a-form-item>
      </a-form>
    </a-modal>
  </white-background>
</template>


<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { getRequest, postRequest } from "@/utils/request";
import { Student } from "@/api/rest-api";
import { messenger } from "@/utils/my-ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import WhiteBackground from "@/components/basic/WhiteBackground.vue";

type ModalAction = "add" | "modify";
type StudentInput = { id: string; name: string; age: number; birthday: string };

export default defineComponent({
  name: "StudentList",
  components: { PlusOutlined, WhiteBackground },
  setup() {
    const data = reactive({
      loading: true,
      modalVisible: false,
      modalTitle: "",
      modalAction: "add" as ModalAction,
      form: {
        id: "",
        name: "",
        age: 0,
        birthday: "",
      } as StudentInput,
      dataSource: [] as Student[],
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "生日",
          dataIndex: "birthday",
          key: "birthday",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      pagination: {
        pageSize: 7, // 默认每页显示数量
        showQuickJumper: true, // 快速跳转
      },
      handleAdd() {
        data.modalTitle = "添加学生";
        data.form = {} as StudentInput;
        data.modalVisible = true;
        data.modalAction = "add";
      },
      handleModify(record: Student) {
        data.modalTitle = "修改学生";
        Object.assign(data.form, record);
        data.modalVisible = true;
        data.modalAction = "modify";
      },
      handleModalConfirm() {
        data.modalVisible = false;
        if (data.modalAction === "add") {
          postRequest("/api/administrator/addStudent", data.form).then(
            (res) => {
              if (res.code === 0) {
                messenger.success("添加成功");
                data.dataSource = res.data as Student[];
              } else {
                messenger.error(`添加失败，${res.message}`);
              }
            }
          );
        } else if (data.modalAction === "modify") {
          getRequest("/api/administrator/updateStudent", data.form).then(
            (res) => {
              if (res.code === 0) {
                messenger.success("修改成功");
                data.dataSource = res.data as Student[];
              } else {
                messenger.error(`修改失败, ${res.message}`);
              }
            }
          );
        }
      },
      handleDelete(record: Student) {
        getRequest("/api/administrator/deleteStudent", { id: record.id }).then(
          (res) => {
            if (res.code === 0) {
              messenger.success("删除成功");
              data.dataSource = res.data as Student[];
            } else {
              messenger.error(`删除失败, ${res.message}`);
            }
          }
        );
      },
    });

    // 初始化table
    getRequest("/api/administrator/allStudents").then((res) => {
      data.loading = false;
      data.dataSource = res.data as Student[];
    });

    return { ...toRefs(data) };
  },
});
</script>

<style scoped lang="scss">
.header {
  height: 50px;
  display: flex;
  align-items: center;
}

.table {
  margin: 0 40px;

  .operation-text {
    margin-right: 0.8em;
  }
}
</style>