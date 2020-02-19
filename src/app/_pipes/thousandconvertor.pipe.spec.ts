import { ThousandconvertorPipe } from './thousandconvertor.pipe';

describe('ThousandconvertorPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandconvertorPipe();
    expect(pipe).toBeTruthy();
  });
});

it('should display in k format', () => {
  const pipe = new ThousandconvertorPipe();
  const mockvalue = 675467;
  const result = pipe.transform(mockvalue);
  console.log(result);
  expect(result).toEqual('675k');
  const mockvalue1 = undefined;
  const result1 = pipe.transform(mockvalue1);
  console.log(result1);
  expect(result1).toEqual('0');
  const mockvalue2 = 728;
  const result2 = pipe.transform(mockvalue2);
  console.log(result2);
  expect(result2).toEqual('728');
});
