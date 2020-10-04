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
            fill: false,
            pointBackgroundColor: "white",
            borderWidth: 3,
            borderColor: "#2cbe4e73",
            pointBorderColor: "#2cbe4e",
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
          fontColor: "#fff",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: "#fff",
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
                fontColor: "#fff",
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
        legend: {
          display: false,
          fontColor: "#fff",
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
