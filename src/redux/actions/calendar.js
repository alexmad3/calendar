import { SELECTED_DATE } from "../types";

export const setSelectedDate = date => ({
  type: SELECTED_DATE,
  payload: date
});

