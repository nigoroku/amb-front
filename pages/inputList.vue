<template>
  <a-list
    item-layout="vertical"
    size="large"
    :pagination="pagination"
    :data-source="listData"
  >
    <a-list-item slot="renderItem" key="item.account_name" slot-scope="item">
      <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <a-icon :type="type" style="margin-right: 8px" />
          {{ text }}
        </span>
      </template>
      <a-list-item-meta :description="item.introduction">
        <a slot="title" :href="item.href">{{ item.account_name }}</a>
        <a-avatar slot="avatar" :src="item.avatar" />
      </a-list-item-meta>
      <p>{{ item.summary }}</p>
      <div v-if="item.input_page">
        <a v-bind:href="item.input_page.url" target="_blank">
          <a-card class="ref-link">
            <div class="ref-link-body">
              <div>
                <h3>{{ item.input_page.title }}</h3>
                <span>{{ item.input_page.description }}</span>
              </div>
              <img v-bind:src="item.input_page.image_url" />
            </div>
          </a-card>
        </a>
      </div>
    </a-list-item>
  </a-list>
</template>
<script>
export default {
  middleware: "authenticated",
  data() {
    return {
      listData: [],
      pagination: {
        onChange: (page) => {
          // console.log(page);
        },
        pageSize: 10,
      },
      actions: [
        { type: "star-o", text: "156" },
        { type: "like-o", text: "156" },
        { type: "message", text: "2" },
      ],
    };
  },
  mounted: function () {
    let self = this;
    this.$http(process.env.boadListApiEndpoit)
      .get("/api/v1/boad/list")
      .then(function (response) {
        let boad_list = response.data.boad_list;
        console.log(boad_list);
        boad_list.forEach((l) => {
          let list = {};
          let user = l.user;
          let input = l.input_list;
          let input_page = l.input_page_summary;
          list.account_name = user.account_name;
          list.introduction = user.introduction;
          if (input != null) {
            list.summary = input.summary;
          }
          if (input_page.image_url) {
            list.input_page = input_page;
          }

          // 顔写真の読み込み
          if (user.account_img != null) {
            var reader = new FileReader();
            reader.onload = function (e) {
              list.avatar = e.target.result;
              self.listData.push(list);
            };

            var createFile4Base64 = function (base64, name, content_type) {
              var bin = atob(base64.replace(/^.*,/, ""));
              var buffer = new Uint8Array(bin.length);
              for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
              }
              return new File([buffer.buffer], name, { type: content_type });
            };

            let file = createFile4Base64(
              user.account_img,
              "tmp",
              user.content_type
            );

            // ファイル読み込みを実行
            reader.readAsDataURL(file);
          } else {
            self.listData.push(list);
          }
        });
      })
      .catch(function () {})
      .finally(function () {});
  },
};
</script>
<style lang="scss" scoped>
.ref-link {
  width: 100%;

  &:hover {
    background: #efefef;
  }

  .ref-link-body {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
}

.ant-avatar {
  background-image: url("../assets/img/no_photo.png");
  background-size: cover;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-position: left top;
  border: 2px solid #f3f3f3;
}
</style>