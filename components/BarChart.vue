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
            backgroundColor: "rgba(215,215,215,0.5)",
            pointBackgroundColor: "#c1c1c1",
            borderColor: "#c1c1c1",
            borderWidth: 1,
            pointBorderColor: "#c1c1c1",
            data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100],
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
