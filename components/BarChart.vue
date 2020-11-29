<script>
import { HorizontalBar } from "vue-chartjs";

let color = "#46BCC1";

export default {
  extends: HorizontalBar,
  props: {
    category_distribution: Array,
  },
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: [
          {
            label: "Data One",
            backgroundColor: color,
            pointBackgroundColor: color,
            // borderColor: "rgba(189,51,181, 0.6)",
            // borderWidth: 1,
            // pointBorderColor: "rgba(189,51,181, 0.7)",
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "学習カテゴリ分布（h）",
          fontSize: 16,
          fontColor: "#000",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return (
                data.labels[tooltipItem.index] +
                ": " +
                data.datasets[0].data[tooltipItem.index] +
                "h"
              );
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    this.renderChart(this.datacollection, this.options);
  },
  watch: {
    category_distribution(newCategories) {
      if (newCategories == null) {
        return;
      }
      // データ取得完了後に再描画する
      let categoryNames = newCategories.map((c) => c.category_name);
      let totalTimes = newCategories.map(
        (c) => Math.round((c.total_time / 60) * 10) / 10
      );
      this.$set(this.datacollection, "labels", categoryNames);
      this.$set(this.datacollection.datasets[0], "data", totalTimes);

      this.renderChart(this.datacollection, this.options);
    },
  },
};
</script>
