<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  props: {
    percents: Object,
  },
  data() {
    return {
      datacollection: {
        labels: ["Input / Output (%)"],
        datasets: [
          {
            label: "input",
            data: [this.percents.input_percentag],
            backgroundColor: "#A24194",
          },
          {
            label: "output",
            data: [this.percents.output_percentag],
            backgroundColor: "#4C53C6",
          },
        ],
      },
      options: {
        steppedLine: true,
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Input / Output (%)",
          fontSize: 20,
          fontColor: "#000",
        },
        scales: {
          yAxes: [
            {
              display: false,
              stacked: true,
              xbarThickness: 10,
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
              },
            },
          ],
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                fontColor: "#000",
              },
            },
          ],
        },
        legend: {
          labels: {
            boxWidth: 50,
            padding: 20,
            fontColor: "#000",
          },
          fontSize: 30,
          display: true,
        },
        tooltips: {
          mode: "label",
        },
      },
    };
  },
  mounted() {
    this.$set(this.datacollection.datasets[0], "data", [
      this.percents.input_percentag,
    ]);
    this.$set(this.datacollection.datasets[1], "data", [
      this.percents.output_percentag,
    ]);

    this.renderChart(this.datacollection, this.options);
  },
  watch: {
    percents(newPercents) {
      // データ取得完了後に再描画する
      this.$set(this.datacollection.datasets[0], "data", [
        newPercents.input_percentag,
      ]);
      this.$set(this.datacollection.datasets[1], "data", [
        newPercents.output_percentag,
      ]);
      this.renderChart(this.datacollection, this.options);
    },
  },
};
</script>
