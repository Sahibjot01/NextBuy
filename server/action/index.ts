import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
class MyCustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error(e);

    //unmask error
    if (e instanceof MyCustomError) {
      return e.message;
    }

    //default error
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
