export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DEVICES":
      return { ...state, devices: action.payload };

    case "SET_LOCATIONS":
      return { ...state, locations: action.payload };

    case "TABLE_DATA":
      return { ...state, TableData: action.payload };

    case "SET_COUNTS":
      return {
        ...state,
        totalCount: action.payload.totalCount,
        activeCount: action.payload.activeCount,
        inactiveCount: action.payload.inactiveCount,
      };

    case "TOGGLE_FORM":
      return { ...state, isFormOpen: !state.isFormOpen };

    case "Fill_DROPDOWN":
      return { ...state, LocationDropDown: action.payload };

    case "SET_DATE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CONFIG_FORM":
      return {...state, configMenu:action.payload}
    case "ROLE_RIGHT":
      return {...state,RoleRights:action.payload}
    default:
      return state;
  }
};
