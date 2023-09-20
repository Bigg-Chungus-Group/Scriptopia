const darkModeReducer = (state = { dark: false }, action) => {
  switch (action.type) {
    case "ENABLE_DARK_MODE":
      return { ...state, dark: true };
    case "DISABLE_DARK_MODE":
      return { ...state, dark: false };
    default:
      return state;
  }
};

export default darkModeReducer;
