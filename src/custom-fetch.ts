export default globalThis.fetch.bind(globalThis);
export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;
export const FormData = globalThis.FormData;
export const Blob = globalThis.Blob;
export const File = globalThis.File;
export const formDataToBlob = (f: FormData) => Promise.resolve(new globalThis.Blob());
