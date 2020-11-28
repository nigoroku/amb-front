<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
            backgroundColor: "rgba(215,215,215,0.5)",
            pointBackgroundColor: "#c1c1c1",
            borderColor: "#c1c1c1",
            borderWidth: 1,
            pointBorderColor: "#c1c1c1",
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "学習カテゴリ分布",
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
