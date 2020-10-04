<template>
  <g-chart
    :type="chartType"
    :data="data"
    :options="chartOptions"
    :createChart="
      (el, google, type) => {
        return new google.visualization[type](el);
      }
    "
    @ready="onChartReady"
  />
</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  components: {
    GChart,
  },
  props: {
    chartType: {
      type: String,
      default: "",
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      viewOption: {
        calc: "stringify",
        type: "string",
        role: "annotation",
      },
      data: null,
    };
  },
  methods: {
    onChartReady(chart, google) {
      console.log("annotation");
      this.addValueLabel(chart, google);
    },
    addValueLabel(chart, google) {
      const dataArr = this.chartData;
      const data = google.visualization.arrayToDataTable(dataArr);

      const formatPercent = new google.visualization.NumberFormat({
        pattern: "#,##0.0%",
      });

      const view = new google.visualization.DataView(data);
      const viewColumn = [];
      const sumObj = this.calcTotal(dataArr);
      dataArr[0].forEach((val, i) => {
        viewColumn.push(i);
        if (i !== 0) {
          const viewOption = JSON.parse(JSON.stringify(this.viewOption));
          viewOption.sourceColumn = i;

          viewOption.calc = (dt, row) => {
            const amount = dt.getValue(row, i) / sumObj[row];
            return formatPercent.formatValue(amount);
          };
          viewColumn.push(viewOption);
        }
      });
      view.setColumns(viewColumn);
      chart.draw(view, this.chartOptions);
    },
    calcTotal(dataArr) {
      const sumObj = {};
      dataArr.forEach((arr, i) => {
        // 1行目はヘッダーなので飛ばす
        if (i !== 0) {
          sumObj[i - 1] = 0;
          arr.forEach((val, j) => {
            // 2行目以降の1カラム目はタイトルなので飛ばす
            if (j !== 0) {
              sumObj[i - 1] += Number(val);
            }
          });
        }
      });
      return sumObj;
    },
  },
};
</script>