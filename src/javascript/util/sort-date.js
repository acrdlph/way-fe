export default function sortDate(arr, qOrNah) {
  qOrNah
    ? arr.sort((a, b) => {
      const c = new Date(a.asked_at);
      const d = new Date(b.asked_at);
      return d - c;
    })
    : arr.sort((a, b) => {
      const c = new Date(a.replied_at);
      const d = new Date(b.replied_at);
      return d - c;
    });
  return arr;
}
