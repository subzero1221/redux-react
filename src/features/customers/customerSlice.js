const initialStateCustomer = { fullName: "", nationalID: "", createdAt: "" };

export default function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.id,
        createdAt: new Date().toISOString(),
      };
    case "customer/updateName":
      return { ...state, fullName: action.payload };
    default:
      return state;
  }
}

export function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalID },
  };
}

export function updateName(fullName) {
  return { type: "customer/updateName", payload: fullName };
}
