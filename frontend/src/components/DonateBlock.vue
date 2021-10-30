<template>
  <div class="donate-block">

    <!-- presets -->
    <div class="presets-block">
      <template v-for="preset in presets" :key="preset">
        <div
          :class="{'preset-selected' : currentValue == prettifyNumber(preset * currentCurrencyObject.rate, currentCurrencyObject.prettyMaxCapacity)}"
          class="preset"
          @click="applyPreset(preset)"
          :title="numberToLocale(preset)"
        >
          {{ numberToLocale(preset) }}
        </div>
      </template>
    </div>

    <!-- form -->
    <div class="input-block">
      <span class="input-currency">
        {{ currentCurrencyObject.symbol }}
      </span>
      <span>
        <input v-model="currentValue" @keypress="preventFloat" @paste.prevent @dragover.prevent @input="inputDirectChange" />
      </span>
      <span>
        <select :value="currentCurrency" @change="currencyChanged">
          <option
            v-for="currency in currencies"
            :key="currency.code"
          >
            {{ currency.code }}
          </option>
        </select>
      </span>
    </div>

    <!-- donation button -->
    <div>
      <button class="donate-button" @click="makeDonation">DONATE</button>
    </div>

  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';

import DonationService from '@/services/DonationService';

interface DonationCurrency {
  name: string;
  code: string;
  symbol: string;
  rate: number;
  prettyMaxCapacity: number;
}

const presets: Array<number> = [40, 100, 200, 1000, 2500, 5000];

const currencies: Array<DonationCurrency> = [
  { name: "US Dollar", code: "USD", symbol: "$", rate: 1, prettyMaxCapacity: 2 },
  { name: "Euro", code: "EUR", symbol: "€", rate: 0.897597, prettyMaxCapacity: 2 },
  { name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755, prettyMaxCapacity: 2 },
  { name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993, prettyMaxCapacity: 4 }
];

@Options({})
export default class DonateBlock extends Vue {
  presets = presets

  currencies = currencies

  currentValue = presets[0] || 0

  unprettiedCurrentValue = presets[0] || 0

  currentCurrency = currencies[0].code

  numberToLocale(preset: number): string {
    if (!this.currentCurrencyObject) {
      console.error('Unknown currency');
      return 'error';
    }
    preset = this.prettifyNumber(preset * this.currentCurrencyObject.rate, this.currentCurrencyObject.prettyMaxCapacity);
    return preset.toLocaleString('en-US', {
      style: 'currency',
      currency: this.currentCurrencyObject.code
    });
  }

  currencyChanged(event: any) {
    if (!this.currentCurrencyObject) {
      console.error('Unknown currency');
      return;
    }
    const previousCurrency = this.currentCurrencyObject;
    this.currentCurrency = event.target.value || this.currentCurrencyObject.code;
    const currCurrency = this.currentCurrencyObject;

    this.unprettiedCurrentValue = (this.unprettiedCurrentValue / previousCurrency.rate) * currCurrency.rate;
    const prettyValue = this.prettifyNumber(this.unprettiedCurrentValue, currCurrency.prettyMaxCapacity);

    if (this.presets.find((value: number) => {
      return this.prettifyNumber(value * currCurrency.rate, currCurrency.prettyMaxCapacity) === prettyValue;
    })) {
      this.currentValue = prettyValue;
    } else {
      this.currentValue = Math.round(this.unprettiedCurrentValue);
    }
  }

  /** prettifyNumber
   * @description Pure, converts number to decimal of a required roundness.
   * @param {number} value Number to prettify.
   * @param {number} maximumCapacity An allowed maximum of zeroes at the end of a result number.
   * @param {number} minimumCapacity A required number of a first non zero numbers left, overrides the maximum capacity.
   */
  prettifyNumber(value: number, maximumCapacity = 2, minimumCapacity = 2) {
    const determineNumberCapacity = (value: number) => {
      if (value < 1) {
        return 1;
      }
      return Math.floor(Math.log10(value)) + 1;
    }

    maximumCapacity += minimumCapacity;
    let numberCapacity = determineNumberCapacity(value);
    if (numberCapacity < minimumCapacity || value < 20) {
      return Math.round(value);
    }
    numberCapacity = numberCapacity > maximumCapacity ? maximumCapacity : numberCapacity;
    let prettyMultiplier = Math.pow(10, (numberCapacity - minimumCapacity));
    prettyMultiplier = prettyMultiplier < 10 ? 10 : prettyMultiplier;
    return (Math.round(value / prettyMultiplier)) * prettyMultiplier;
  }

  applyPreset(preset: number) {
    if (!this.currentCurrencyObject) {
      console.error('Unknown currency');
      return;
    }
    this.unprettiedCurrentValue = preset * this.currentCurrencyObject.rate;
    this.currentValue = this.prettifyNumber(this.unprettiedCurrentValue, this.currentCurrencyObject.prettyMaxCapacity);
  }

  preventFloat(event: KeyboardEvent) {
    let keyCode = Number.parseInt(event.code, 10);
    // if keycode not numbers or dot, then prevent default
    if ((keyCode < 48 || keyCode > 57 || keyCode === 46)) {
      event.preventDefault();
    }
  }

  inputDirectChange(event: any) {
    this.unprettiedCurrentValue = Number.parseInt(event.target.value || '0');
  }

  makeDonation() {
    DonationService.makeDonation(this.currentValue, this?.currentCurrencyObject?.code || '').then((response) => {
      if (response.data.ok === true) {
        alert('Thank you for your donation!');
      } else {
        alert('Unfortunately we are unable to proceed your donation');
      }
    });
  }

  get currentCurrencyObject(): DonationCurrency | null {
    return this.currencies.find((v) => v.code === this.currentCurrency) || null;
  }
}
</script>

<style scoped>

.donate-block {
  background: #f5f5f5;
  border: solid 1px #d4d4d4;
  border-radius: 5px;
  padding: 15px;
  max-width: 350px;
}

.presets-block {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.presets-block .preset {
  text-align: center;
  vertical-align: middle;
  font-weight: 500;
  height: 40px;
  line-height: 34px;
  margin: 2px;
  padding: 3px;
  border: solid 1px #dfdfdf;
  border-radius: 5px;
  background: #fdfdfd;
  color: #515151;
  overflow: hidden;
}

.presets-block .preset:hover {
  cursor: pointer;
}

.presets-block .preset-selected {
  border: solid 1px;
  background: #4c82d3;
  color: #FFFFFF;
}

.input-block {
  margin: 10px 2px 20px 2px;
  height: 50px;
  border: solid 1px #8e939f;
  border-radius: 5px;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}

.input-block .input-currency {
  margin: 5px;
  font-size: 1.2em;
}

.input-block input:focus {
  outline: none;
}

.input-block input {
  font-size: 2em;
  width: 100%;
  overflow: hidden;
  /* margin-left: 5px; */
}

.input-block select {
  font-size: 0.85em;
}

.selected-sum {
  color: #5491eb;
}

.donate-button {
  margin: 0px 2px 0px 2px;
  background: #5491eb;
  color: white;
  width: 100%;
  padding: 10px;
  border: solid 1px #e0e0e0;
  border-radius: 5px;
}

</style>
