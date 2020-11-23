<script>
import { HorizontalBar } from "vue-chartjs";

export default {
  extends: HorizontalBar,
  data() {
    return {
      datacollection: {
        labels: ["Input / Output (%)"],
        datasets: [
          {
            label: "input",
            data: [64],
            backgroundColor: "#a7873f78",
            borderColor: "#a7873f",
            borderWidth: 1,
          },
          {
            label: "output",
            data: [36],
            backgroundColor: "#681e7d85",
            borderColor: "#681e7d",
            borderWidth: 1,
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
    this.renderChart(this.datacollection, this.options);
  },
};
</script>
