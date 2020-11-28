<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    date_unit: Array,
  },
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: [
          {
            label: "Data One",
            fill: true,
            pointBackgroundColor: "#d2d2d2bf",
            borderWidth: 1,
            borderColor: "#c1c1c1",
            pointBorderColor: "#c1c1c1",
            backgroundColor: "rgba(215,215,215,0.5)",
            lineTension: 0,
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "学習時間推移（h）",
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
          fontColor: "#000",
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
    date_unit(newUnit) {
      // データ取得完了後に再描画する
      let labels = newUnit.map((c) => c.label);
      let times = newUnit.map((c) => Math.round((c.time / 60) * 10) / 10);
      this.$set(this.datacollection, "labels", labels);
      this.$set(this.datacollection.datasets[0], "data", times);

      this.renderChart(this.datacollection, this.options);
    },
  },
};
</script>
