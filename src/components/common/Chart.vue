<script>
import { Line, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['currency'],
  computed: {
    options() {
      return {
        tooltips: {
          callbacks: {
            title: (tooltipItem, data) => {
              return (
                tooltipItem[0].label +
                ' (' +
                parseFloat(
                  this.chartData.percents[tooltipItem[0].index]
                ).toFixed(2) +
                '%)'
              )
            },
            label: (tooltipItem, data) => {
              let label = data.datasets[tooltipItem.datasetIndex].label
              let value =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              value = parseFloat(value)
                .toLocaleString('es-MX')
                .toString()

              return label + ': ' + value
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks

                callback: (value, index, values) => {
                  return (
                    parseFloat(value)
                      .toLocaleString('es-MX')
                      .toString() +
                    ' ' +
                    this.currency
                  )
                }
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  },
  data: function() {
    return {
      loaded: true
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
