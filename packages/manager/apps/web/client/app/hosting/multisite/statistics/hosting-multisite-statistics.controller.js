import { CDN_ACTIVE } from '../hosting-multisite.constants';

const CDN_SERIES = {
  NAME: {
    HIT: 'hit',
    MISS: 'miss',
  },
  COLORS: {
    RED: 'red',
    TURQUOISE: 'turquoise',
  },
};

export default class HostingMultisiteStatistisController {
  $onInit() {
    this.activeDomains = this.domains.list.results
      .filter(({ cdn }) => cdn === CDN_ACTIVE)
      .map(({ domain }) => domain);

    this.chart = this.chartJsFactory(
      HostingMultisiteStatistisController.getChartConfiguration(),
    );
  }

  fillChart(statistics) {
    statistics.forEach((serie) => {
      this.chart.addSerie(
        serie.name,
        serie.points.map(({ timestamp, value }) => ({
          x: timestamp,
          y: parseFloat(value.toFixed(2)),
        })),
        {
          dataset: {
            fill: serie.name === CDN_SERIES.NAME.HIT,
            borderWidth: 1,
            borderColor:
              serie.name === CDN_SERIES.NAME.HIT
                ? CDN_SERIES.COLORS.TURQUOISE
                : CDN_SERIES.COLORS.RED,
          },
        },
      );
    });
  }

  getDomainStatistics(domain, period) {
    this.isLoadingStatistics = true;
    this.hasLoadingError = false;

    return this.getStatistics(domain, period?.value)
      .then((statistics) => {
        this.fillChart(statistics);
      })
      .catch(() => {
        this.hasLoadingError = true;
      })
      .finally(() => {
        this.isLoadingStatistics = false;
      });
  }

  static getChartConfiguration() {
    return {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          display: true,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        tooltips: {
          mode: 'label',
          intersect: false,
          callbacks: {
            title([firstData]) {
              return moment(firstData.xLabel).fromNow();
            },
          },
        },
        scales: {
          yAxes: [
            {
              display: true,
              position: 'left',
              scaleLabel: {
                display: true,
              },
              gridLines: {
                drawBorder: true,
                display: true,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              position: 'bottom',
              gridLines: {
                drawBorder: true,
                display: false,
              },
              time: {
                displayFormats: {
                  hour: 'LT',
                },
              },
            },
          ],
        },
      },
    };
  }
}
