# Audica

Extract Bytetime/Frequency data from audio or video elements, to create awesome audio visualizations.

## What is it?

Audica is a lightweight abstraction around `AudioContext` and `webkitAudioContext`. It allows for quick and easy extraction of data via `WebAudioAPI`'s `AnalyserNode` to capture data into an array so you can easily create fun and beautiful audio visualizations.

## Features

* Dead simple API
* Use either bytetime data, frequency data, or both!
* Connects to either `<audio>` or `<video>` HTML elements
* Built in TypeScript support for IDE embedded documentation in VSCode.
## How to use

Install with `npm install audica` if you're using Node.js

### Bundled client side applications

```js
const audica = require('audica');
// OR
import audica from 'audica';

```

### Client side app
```html
<!-- Install via unpkg -->

<script src="https://unpkg.com/audica"></script>
<!-- Your HTML here -->

<script>
  const myAudica = audica({ /* options */});
</script>
```

## Examples of usage

### Barebones/Minimum

```js
const myAudica = audica({
  element: document.getElementById('audio-element'),
  size: 256
});

const animationLoop = () => {
  window.requestAnimationFrame(animationLoop);

  // array of ByteTime data
  const data = myAudica.getData();

  for (let i = 0; i < 256; i++) {
    // Do something with this array of integers representing byte time data
  }
}
```

Get frequency data and show some bars moving at 60 FPS

```js
const myAudica = audica({
  element: document.getElementById('audio-element'),
  size: 256,
  dataType: 'hz' // defaults to 'time' if left undefined
});

const animationLoop = () => {
  window.requestAnimationFrame(animationLoop);

  // array of ByteTime data
  const data = myAudica.getData();

  // Get 256 divs that are on the DOM
  const bars = Array.from(document.querySelectorAll('.bar'));

  for (let i = 0; i < bars.length; i++) {
    // Color every bar white and make it as tall as the frequency data
    bars[i].style = `height: ${data[i]}px; width: 3px; background-color: white;`;
  }
}
```

## Audica API

### Create a new Audica instance
```js
const options = {
  /**
   * Size of the array of audio data to be returned from Audica.
   * A larger number means more fine grained control, but lowers performance.
   * This number must be larger than 8, and divisible by 8.
   *
   * NOTE FOR NERDS: This value becomes analyzer.fftSize.
   * analyzer.fftSize = size * 2
   *
   * @default 256
   */
  size: 256,

  /**
   * The Audio or video element to draw audio data from. This value cannot
   * be null or falsy.
   * @required
   */
   element: document.querySelector('audio'),

   /**
   * Type of Frequency data to retrieve.
   * 'time' returns byte time frequency data (think waveform)
   * 'hz' returns frequency data, where data[0] starts with lower (bass) frequencies,
   * and the later elements in the array (data[255]) are higher (treble) frequencies
   *
   * @default 'time'
   */
    dataType: 'time' || 'hz';
}
const myAudica = audica(audicaOptions);

/**
 *  The heart of Audica - retrives bytetime or frequency data from the attached
 *  audio/video element at the current time
 */
myAudica.getData();

/**
 * Change the type of data Audica is returning, can be set to 'time' or 'hz'
 * */
myAudica.setDataType('time' || 'hz');
```

Created with <3 by Ben Junya [@MrBenJ](https://www.twitter.com/MrBenJ5)
