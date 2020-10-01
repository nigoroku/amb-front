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
      <a-list-item-meta :description="item.summary">
        <a slot="title" :href="item.href">{{ item.account_name }}</a>
        <a-avatar slot="avatar" :src="item.avatar" />
      </a-list-item-meta>
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
          if (input != null) {
            list.summary = input.summary;
          }
          if (input_page.image_url) {
            list.input_page = input_page;
          }
          self.listData.push(list);

          // 顔写真の読み込み
          if (user.account_img != null) {
            var reader = new FileReader();
            reader.onload = function (e) {
              list.avatar = e.target.result;
            };

            var createPngFile4Base64 = function (base64, name) {
              var bin = atob(base64.replace(/^.*,/, ""));
              var buffer = new Uint8Array(bin.length);
              for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
              }
              return new File([buffer.buffer], name, { type: "image/png" });
            };

            let file = createPngFile4Base64(user.account_img, "tmp");

            // ファイル読み込みを実行
            reader.readAsDataURL(file);
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
</style>