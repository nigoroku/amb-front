<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      datacollection: {
        labels: [
          "クラウド",
          "テスト",
          "CI/CD",
          "コーディング",
          "デザイン",
          "データベース",
          "モバイル",
          "マーケティング",
          "AI",
          "データ分析",
          "VR / AR",
          "フロントエンド",
          "バックエンド",
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#2cbe4e73",
            pointBackgroundColor: "white",
            borderColor: "#2cbe4e",
            borderWidth: 1,
            pointBorderColor: "#249EBF",
            data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "学習カテゴリ分布",
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
