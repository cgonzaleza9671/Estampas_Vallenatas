const noop = () => {};
const mock = new Proxy(noop, {
  get: () => mock
});
export default mock;
