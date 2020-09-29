<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
    <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
      <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <a-icon :type="type" style="margin-right: 8px" />
          {{ text }}
        </span>
      </template>
      <a-list-item-meta :description="item.description">
        <a slot="title" :href="item.href">{{ item.title }}</a>
        <a-avatar slot="avatar" :src="item.avatar" />
      </a-list-item-meta>
      {{ item.content }}
    </a-list-item>
  </a-list>
</template>
<script>
// const listData = [];
// for (let i = 0; i < 23; i++) {
//   listData.push({
//     href: "https://www.antdv.com/",
//     title: `ant design vue part ${i}`,
//     avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
//     description:
//       "Ant Design, a design language for background applications, is refined by Ant UED Team.",
//     content:
//       "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
//   });
// }

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
          list.title = user.account_name;
          list.description = user.introduction;
          self.listData.push(list);

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

    // this.listData.push({
    //   title: `ant design vue part`,
    //   avatar:
    //     "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    //   description:
    //     "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    //   content:
    //     "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    // });
  },
};
</script>
<style></style>