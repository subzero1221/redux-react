import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      if (state.balance > action.payload) state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return { payload: { amount, purpose } };
      },

      reducer(state, action) {
        if (state.loan < 0) return;
        state.loan += action.payload.amount;
        state.balance += action.payload.amount;
        state.loanPurpose = action.payload.purpose;
      },
    },
    payLoan(state, action) {
      if (state.loan > 0) {
        state.balance -= state.loan;
        state.loan = 0;
        state.loanPurpose = "";
      }
    },
    convertingCur(state) {
      state.isLoading = true;
    },
  },
});

console.log(accountSlice);

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  if (currency === "EUR")
    return async function (dispatch, getState) {
      dispatch({ type: "account/convertingCur" });
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
      );
      const data = await res.json();
      const currencyAmount = data.rates.USD;
      dispatch({ type: "account/deposit", payload: currencyAmount });
    };

  if (currency === "GBP")
    return async function (dispatch, getState) {
      dispatch({ type: "account/convertingCur" });
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
      );
      const data = await res.json();
      const currencyAmount = data.rates.USD;

      dispatch({ type: "account/deposit", payload: currencyAmount });
    };
}

export default accountSlice.reducer;
