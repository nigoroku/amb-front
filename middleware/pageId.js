export default function({ route, store }) {
  store.commit("setCurrentPage", route.meta[0].page_id);
}
