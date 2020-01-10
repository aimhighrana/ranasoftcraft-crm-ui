import { SubstringPipe } from './substringpipe.pipe';
import { async } from '@angular/core/testing';

describe('SubstringPipe', () => {
  it('create an instance', () => {
    const pipe = new SubstringPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform: test transform method', async(() => {
    const pipeObject = new SubstringPipe();
    const mockString = 'Function Location for  Group(s) testing';
    const actualString =  pipeObject.transform(mockString);
    expect(actualString).toEqual('Function Location for  Group(s) te..');
  }));
});
