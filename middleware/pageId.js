export default function({ route, store }) {
  console.log(route);
  console.log(store);
  // store.commit("setCurrentPage", route.meta[0].page_id);
}
