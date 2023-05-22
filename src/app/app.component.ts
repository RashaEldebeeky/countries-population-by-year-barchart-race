import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import dataJson from '../assets/data.json';
import { buttonModes } from './app.constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  Highcharts = Highcharts;
  animationInterval: any;
  populationData: any = {};
  updateFlag = false;
  chartOptions: any = {};
  buttonConfig = buttonModes.play;
  selectedYear = 0;
  rangeInputConfig = {
    start: 0,
    end: 0,
  };

  ngOnInit() {
    this.populationData = this.formatPopulationData();
    this.rangeInputConfig = {
      start: dataJson[0].Year,
      end: dataJson[dataJson.length - 1].Year,
    };
    this.selectedYear = this.rangeInputConfig.start;
    this.chartOptions = this.getChartOptions();
  }

  /**
   * get chart drawing options
   */
  getChartOptions() {
    return {
      chart: {
        animation: {
          duration: 800,
        },
      },
      plotOptions: {
        series: {
          groupPadding: 0,
        },
      },
      title: {
        text: this.selectedYear,
        style: {
          color: '#807d7d',
          fontSize: '30px',
        },
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            color: '#000',
          },
        },
      },
      yAxis: [
        {
          visible: false,
        },
      ],
      series: [
        {
          name: this.selectedYear,
          data: this.populationData[this.selectedYear],
          colorByPoint: true,
          dataSorting: {
            enabled: true,
            matchByName: true,
          },
          type: 'bar',
          dataLabels: [
            {
              enabled: true,
              style: {
                textOutline: false,
                color: '#807d7d',
              },
            },
          ],
        },
      ],
    };
  }

  /**
   * format data for chart series
   * {year1: [[country1, population1], [country2, population2], ...],
   *  year2: [[country1, population1], [country2, population2], ...],
   * ...}
   */
  formatPopulationData() {
    let result: any = {};
    dataJson.forEach((year) => {
      result[year.Year] = [];
      year.Countries.forEach((country) => {
        result[year.Year].push([country.Country, country.Population]);
      });
    });
    return result;
  }

  inputValueChanged(value: number) {
    this.selectedYear = value;
    if (this.buttonConfig === buttonModes.repeat) {
      this.buttonConfig = buttonModes.play;
    }
    this.update(false);
  }

  /**
   * Update the chart. This happens either on moving the range input,
   * or from a timer when the timeline is playing.
   */
  update(auto: boolean) {
    if (this.selectedYear === this.rangeInputConfig.end) {
      this.pause();
      this.buttonConfig = buttonModes.repeat;
    } else if (auto) {
      this.selectedYear = this.selectedYear + 1;
    }
    this.chartOptions.series = {
      name: this.selectedYear,
      data: this.populationData[this.selectedYear],
    };
    this.chartOptions.title.text = this.selectedYear;
    this.updateFlag = true;
  }

  /**
   * Play the timeline.
   */
  play() {
    this.buttonConfig = buttonModes.pause;
    this.animationInterval = setInterval(() => {
      this.update(true);
    }, 1000);
  }

  /**
   * Pause the timeline, either when the range is ended, or when clicking the pause button.
   */
  pause() {
    this.buttonConfig = buttonModes.play;
    clearTimeout(this.animationInterval);
    this.animationInterval = undefined;
  }

  playButtonClicked() {
    if (this.selectedYear === this.rangeInputConfig.end) {
      this.selectedYear = this.rangeInputConfig.start;
      this.play();
    } else {
      if (this.animationInterval) {
        this.pause();
      } else {
        this.play();
      }
    }
  }
}
