export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DEVICES':
      return { ...state, devices: action.payload };

    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };

    case 'Table_Data':
      return { ...state, TableData: action.payload }

    case 'SET_COUNTS':
      return {
        ...state,
        totalCount: action.payload.totalCount,
        activeCount: action.payload.activeCount,
        inactiveCount: action.payload.inactiveCount,
      };

    case "SET_SELECTED_CONTACT":
      return {
        ...state, selectedContact: action.payload,
      };

    case 'TOGGLE_FORM':
      return { ...state, isFormOpen: !state.isFormOpen, selectedId: action.payload };

    case 'TOGGLE_CONTACT_FORM':
      return { ...state, isContactFormOpen: !state.isContactFormOpen, selectedContact: action.payload };

    case 'Fill_DROPDOWN':
      return { ...state, LocationDropDown: action.payload }

    default:
      return state;
  }
};
