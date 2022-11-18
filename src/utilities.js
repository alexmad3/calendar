export const dateToNumDate = (date = new Date()) =>
  +(new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate()));
