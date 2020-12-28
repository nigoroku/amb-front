<template>
  <div>
    <div class="content-box search-box">
      <h3 style="padding-top: 4px">
        <font-awesome-icon
          icon="align-left"
          style="margin-right: 8px"
        />アウトプットタイムライン
      </h3>
      <a-input-search
        placeholder="キーワードで探す"
        style="width: 300px"
        v-model="search_text"
        @change="onSearch"
      />
    </div>
    <div class="content-box">
      <a-list
        item-layout="vertical"
        size="large"
        :pagination="pagination"
        :data-source="searchedList"
      >
        <a-list-item
          slot="renderItem"
          key="item.achievement_id"
          slot-scope="item"
        >
          <template v-for="{ icon, text } in actions" slot="actions">
            <span :key="icon" @click="changeAction(text, item)">
              <font-awesome-icon
                :icon="icon"
                v-bind:class="bindActiveClass(text, item)"
                style="margin-right: 8px"
              />
              {{ text + " " + countAction(text, item) }}
            </span>
          </template>
          <div style="display: flex">
            <a-list-item-meta>
              <a slot="title" :href="item.href">{{ item.account_name }}</a>
              <a-avatar slot="avatar" :src="item.avatar" />
            </a-list-item-meta>
            <h4 style="color: #949494">{{ item.date }}に登録</h4>
          </div>
          <div style="margin-bottom: 10px">
            <a-tag
              v-for="c in item.categories"
              :key="c.category_id"
              :color="c.color_code"
              >{{ c.name }}</a-tag
            >
          </div>
          <div v-if="item.summary">
            <p>{{ item.summary }}</p>
          </div>
          <div v-if="item.output_page">
            <a v-bind:href="item.output_page.url" target="_blank">
              <a-card class="ref-link">
                <div class="ref-link-body">
                  <div style="width: 60%">
                    <h3>{{ item.output_page.title }}</h3>
                    <span>{{ item.output_page.description }}</span>
                  </div>
                  <div
                    class="page-img-box"
                    v-bind:style="{
                      'background-image':
                        'url(' + item.output_page.image_url + ')',
                    }"
                  ></div>
                </div>
              </a-card>
            </a>
          </div>
        </a-list-item>
        <a-empty v-show="!loading && searchedList.length == 0" />
      </a-list>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import { mapState, mapGetters } from "vuex";

export default {
  layout: "timeline",
  data() {
    return {
      listData: [],
      searchedList: [],
      selectedActions: [],
      search_text: "",
      pagination: {
        onChange: (page) => {
          // console.log(page);
        },
        pageSize: 10,
      },
      actions: [
        { id: "1", icon: "thumbs-up", text: "LGTM" },
        { id: "2", icon: "layer-group", text: "ストック" },
      ],
    };
  },
  computed: {
    ...mapState(["loading"]),
    ...mapGetters(["getUserId"]),
  },
  mounted: function () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });

    let self = this;
    // ユーザーに紐づく選択済みアクションを取得する
    this.$http(process.env.boadListApiEndpoit)
      .get("/api/v1/timeline/output/selected_actions?user_id=" + this.getUserId)
      .then(function (response) {
        self.selectedActions = response.data.selected_actions;
      })
      .catch(function () {})
      .finally(function () {});

    // タイムライン情報取得
    this.$http(process.env.boadListApiEndpoit)
      .get("/api/v1/timeline/output")
      .then(function (response) {
        let timeline = response.data.timeline;

        timeline.forEach((l) => {
          let line = l;
          let output_page = l.output_page_summary;
          line.date = moment(l.created_at).format("YYYY/MM/DD");

          // ログインユーザーのLGTMアクションが行われているかどうか設定
          if (self.selectedActions != null) {
            line.lgtm = self.selectedActions
              .filter((a) => a.action_type == "1")
              .some((a) => a.output_achievement_id == line.achievement_id);
            // ログインユーザーのストックアクションが行われているかどうか設定
            line.stock = self.selectedActions
              .filter((a) => a.action_type == "2")
              .some((a) => a.output_achievement_id == line.achievement_id);
          }

          // アクションタイプのカウント数を設定する
          if (line.action_types != null) {
            line.lgtmCount = line.action_types.filter((a) => a == "1").length;
            line.stockCount = line.action_types.filter((a) => a == "2").length;
          } else {
            line.lgtmCount = 0;
            line.stockCount = 0;
          }

          if (output_page.image_url) {
            line.output_page = output_page;
          }

          // 顔写真の読み込み
          if (l.account_img != null) {
            var reader = new FileReader();
            reader.onload = function (e) {
              line.avatar = e.target.result;
              self.listData.push(line);
            };

            var createFile4Base64 = function (base64, name, content_type) {
              var bin = atob(base64.replace(/^.*,/, ""));
              var buffer = new Uint8Array(bin.length);
              for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
              }
              return new File([buffer.buffer], name, { type: content_type });
            };

            let file = createFile4Base64(l.account_img, "tmp", l.content_type);

            // ファイル読み込みを実行
            reader.readAsDataURL(file);
          } else {
            self.listData.push(line);
          }
        });

        // 検索用のリストを別途保持する
        self.searchedList = self.listData;
        // loading を非表示にする
        self.$nuxt.$loading.finish();
      })
      .catch(function () {})
      .finally(function () {});
  },
  methods: {
    onSearch(e) {
      let val = this.search_text;
      this.searchedList = this.listData.filter(
        (l) =>
          (l.account_name != null && l.account_name.includes(val)) ||
          (l.introduction != null && l.introduction.includes(val)) ||
          (l.summary != null && l.summary.includes(val)) ||
          (l.categories != null &&
            l.categories.map((c) => c.name).includes(val)) ||
          (l.date && l.date.includes(val))
      );
    },
    bindActiveClass(text, line) {
      if (text == "LGTM") {
        return line.lgtm ? "active-action" : "";
      } else if (text == "ストック") {
        return line.stock ? "active-action" : "";
      }
      return "";
    },
    changeAction(text, line) {
      if (text == "LGTM") {
        line.lgtm = !line.lgtm;
        if (line.lgtm) {
          line.lgtmCount++;
        } else {
          line.lgtmCount--;
        }
        // アクションの更新
        this.$http(process.env.boadListApiEndpoit)
          .post("/api/v1/timeline/output/update_action", {
            user_id: this.getUserId,
            action_type: "1",
            insert: line.lgtm,
            achievement_id: line.achievement_id,
          })
          .then(function (response) {})
          .catch(function () {})
          .finally(function () {});
      } else if (text == "ストック") {
        line.stock = !line.stock;
        if (line.stock) {
          line.stockCount++;
        } else {
          line.stockCount--;
        }
        // アクションの更新
        this.$http(process.env.boadListApiEndpoit)
          .post("/api/v1/timeline/output/update_action", {
            user_id: this.getUserId,
            action_type: "2",
            insert: line.stock,
            achievement_id: line.achievement_id,
          })
          .then(function (response) {})
          .catch(function () {})
          .finally(function () {});
      }
    },
    countAction(text, line) {
      if (text == "LGTM") {
        return line.lgtmCount;
      } else if (text == "ストック") {
        return line.stockCount;
      }
      return 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.content-box {
  background: #fff;
  padding: 10px 24px;
}

.search-box {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e4e4e4;
}

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

.active-action {
  color: #2cbe4e;
}

.page-img-box {
  width: 30%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
}
</style>