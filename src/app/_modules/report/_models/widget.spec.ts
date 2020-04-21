import { Widget } from './widget';

describe('Widget', () => {
  it('should create an instance', () => {
    expect(new Widget(0,0,0,0,null,null)).toBeTruthy();
  });
});
