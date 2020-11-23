<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {
      datacollection: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
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
            data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "学習時間推移",
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
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    this.renderChart(this.datacollection, this.options);
  },
};
</script>
