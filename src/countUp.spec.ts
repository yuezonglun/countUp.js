import { CountUp } from './countUp';

describe('CountUp', () => {

  let countUp;
  let time;

  const resetRAF = () => {
    time = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      time += 100;
      if (time < 2500) {
        return cb(time) as any;
      }
    });
  };

  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <h1 id="target"></h1>' +
      '</div>';

    countUp = new CountUp('target', 100);
    resetRAF();
  });

  describe('constructor', () => {

    it('should create for a valid target, and print startVal', () => {
      expect(countUp).toBeTruthy();
      expect(countUp.error.length).toBe(0);
      expect(document.getElementById('target').innerHTML).toEqual('0');
    });

    it('should set an error for a bad target', () => {
      countUp = new CountUp('notThere', 100);

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad endVal', () => {
      const endVal = '%' as any;
      countUp = new CountUp('target', endVal);

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should set an error for a bad startVal', () => {
      const startVal = 'oops' as any;
      countUp = new CountUp('target', 100, { startVal });

      expect(countUp.error.length).toBeGreaterThan(0);
    });

    it('should return a value for version', () => {
      expect(countUp.version).toBeTruthy();
    });
  });

  describe('class methods', () => {
    it('should count when start method is called', () => {
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100');
    });

    it('should pause when pauseResume is called', () => {
      countUp.start();
      // resetRAF();
      countUp.pauseResume();

      expect(countUp.paused).toBeTruthy();
    });

    it('should reset when reset is called', () => {
      countUp.start();
      countUp.reset();

      expect(document.getElementById('target').innerHTML).toEqual('0');
      expect(countUp.paused).toBeTruthy();
    });

    it('should update when update is called', () => {
      countUp.start();
      expect(document.getElementById('target').innerHTML).toEqual('100');

      resetRAF();
      countUp.update(200);
      expect(document.getElementById('target').innerHTML).toEqual('200');
    });

  });

  describe('various use-cases', () => {
    it('should handle large numbers', () => {
      countUp = new CountUp('target', 6000);
      const spy = jest.spyOn(countUp, 'determineIfWillAutoSmooth');
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('6,000');
      expect(spy).toHaveBeenCalled();
    });

    it('should not use easing when specified with a large number (auto-smooth)', () => {
      countUp = new CountUp('target', 6000, { useEasing: false });
      const spy = jest.spyOn(countUp, 'easingFn');
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('6,000');
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should count down when endVal is less than startVal', () => {
      countUp = new CountUp('target', 10, { startVal: 500 });
      expect(document.getElementById('target').innerHTML).toEqual('500');
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('10');
    });

    it('should handle negative numbers', () => {
      countUp = new CountUp('target', -500);
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('-500');
    });

    it('should properly handle a zero duration', () => {
      countUp = new CountUp('target', 2000, { duration: 0 });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('2,000');
    });

    it('should call the callback when finished if there is one', () => {
      const cb = jest.fn();
      countUp.start(cb);

      expect(document.getElementById('target').innerHTML).toEqual('100');
      expect(cb).toHaveBeenCalled();
    });
  });

  describe('options', () => {
    it('should respect the decimalPlaces option', () => {
      countUp = new CountUp('target', 100, { decimalPlaces: 2 });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100.00');
    });

    it('should respect the duration option', () => {
      countUp = new CountUp('target', 100, { duration: 1 });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100');
    });

    it('should respect the useEasing option', () => {
      countUp = new CountUp('target', 100, { useEasing: false });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100');
    });

    it('should respect the useGrouping option', () => {
      countUp = new CountUp('target', 10000, { useGrouping: false });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('10000');
    });

    it('should respect the separator option', () => {
      countUp = new CountUp('target', 10000, { separator: ':' });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('10:000');
    });

    it('should respect the separator option', () => {
      countUp = new CountUp('target', 10000, { separator: ':' });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('10:000');
    });

    it('should respect the decimal option', () => {
      countUp = new CountUp('target', 100, { decimal: ',', decimalPlaces: 1 });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100,0');
    });

    it('should respect the easingFn option', () => {
      const easeOutQuintic = jest.fn().mockReturnValue(100);
      countUp = new CountUp('target', 100, { easingFn: easeOutQuintic });
      countUp.start();

      expect(easeOutQuintic).toHaveBeenCalled();
      expect(document.getElementById('target').innerHTML).toEqual('100');
    });

    it('should respect the formattingFn option', () => {
      const formatter = jest.fn().mockReturnValue('~100~');
      countUp = new CountUp('target', 100, { formattingFn: formatter });
      countUp.start();

      expect(formatter).toHaveBeenCalled();
      expect(document.getElementById('target').innerHTML).toEqual('~100~');
    });

    it('should respect the prefix option', () => {
      countUp = new CountUp('target', 100, { prefix: '$' });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('$100');
    });

    it('should respect the suffix option', () => {
      countUp = new CountUp('target', 100, { suffix: '!' });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('100!');
    });

    it('should respect the numerals option', () => {
      const numerals = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
      countUp = new CountUp('target', 100, { numerals });
      countUp.start();

      expect(document.getElementById('target').innerHTML).toEqual('!))');
    });
  });
});
