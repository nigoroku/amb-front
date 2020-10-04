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
            backgroundColor: "#2cbe4e73",
            borderColor: "#2cbe4e",
            borderWidth: 1,
          },
          {
            label: "output",
            data: [36],
            backgroundColor: "rgba(100, 181, 246, 0.4)",
            borderColor: "#64b5f6",
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
          fontColor: "#fff",
        },
        scales: {
          yAxes: [
            {
              display: false,
              stacked: true,
              xbarThickness: 10,
              ticks: {
                beginAtZero: true,
                fontColor: "#fff",
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
                fontColor: "#fff",
              },
            },
          ],
        },
        legend: {
          labels: {
            boxWidth: 50,
            padding: 20,
            fontColor: "#fff",
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
