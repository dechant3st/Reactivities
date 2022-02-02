import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setServerError = (error: ServerError) => {
    console.log(error);
    this.error = error;
  };
}
