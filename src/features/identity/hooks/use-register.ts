import { registerStudent } from "../api";
import { useAuthAction } from "./use-auth-action";

export function useRegister() {
  const action = useAuthAction();
  function register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ) {
    return action.run(() =>
      registerStudent({ first_name, last_name, email, password }),
    );
  }
  return { ...action, register };
}
