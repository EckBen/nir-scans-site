import { toast } from "react-toastify";

export default async function asyncWithTimeout(
  asyncFn,
  timeout=15000,
  errorMsg='',
  toastProps={},
  ignoreErrors=[]
) {
  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, timeout);
  });

  try {
    const result = await Promise.race([asyncFn, timeoutPromise]);
    return result;
  } catch (err) {
    if (!ignoreErrors.includes(err.message)) {
      console.error(err);
      toast.error(errorMsg, { ...toastProps });
    }
    return { error: errorMsg };
  }
}