const audioContext = (window.AudioContext || window.webkitAudioContext);
const AudicaDefaultOptions: Partial<AudicaOptions> = {
  size: 256,
  dataType: 'time'
};

interface AudicaOptions {
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
  size: number;

  /**
   * The Audio or video element to draw audio data from. This value cannot
   * be null or falsy. This is a required value
   * @required
   */
  element: (HTMLAudioElement | HTMLVideoElement);

  /**
   * Type of Frequency data to retrieve.
   * 'time' returns byte time frequency data (think waveform)
   * 'hz' returns frequency data, where data[0] starts with lower (bass) frequencies,
   * and the later elements in the array (data[50]) are higher (treble) frequencies
   */
  dataType: ('time' | 'hz');
};

/**
 * The Audica instance returned by audica().
 */
class Audica {
  options: AudicaOptions;
  audioContext: AudioContext;
  source: MediaElementAudioSourceNode;
  analyzer: AnalyserNode;

  constructor(options: AudicaOptions) {
    this.options = {
      ...AudicaDefaultOptions,
      ...options
    };

    if (this.options.size % 8 !== 0) {
      throw new Error('Size must be a number greater than 8 and divisible by 8');
    }

    if (!this.options.element) {
      throw new Error('No element Provided to options.element. Pass in an HTML <video> or <audio> element!');
    }

    this.audioContext = new audioContext();
    this.source = this.audioContext.createMediaElementSource(this.options.element);
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = this.options.size * 2;

    this.source
      .connect(this.analyzer)
      .connect(this.audioContext.destination);
  }

  setDataType = (type: AudicaOptions['dataType']) => {
    this.options = {
      ...this.options,
      dataType: type
    };
  }

  getData = (): Uint8Array => {
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.analyzer[this.options.dataType === 'time'
      ? 'getByteTimeDomainData'
      : 'getByteFrequencyData'
    ](dataArray);

    return dataArray;
  }

}

const audica = (options: AudicaOptions) => {
  return new Audica(options);
};
