export const reducer = (state, action) => {
    switch (action.type) {

      case 'SET_DEVICES':
        return { ...state, devices: action.payload };

      case 'SET_LOCATIONS':
        return { ...state, locations: action.payload };
      
     case 'Table_Data':
        return{...state, TableData:action.payload}

      case 'SET_COUNTS':
        return {
          ...state,
          totalCount: action.payload.totalCount,
          activeCount: action.payload.activeCount,
          inactiveCount: action.payload.inactiveCount,
        };

      case 'TOGGLE_FORM':
        return { ...state, isFormOpen: !state.isFormOpen, selectedId: action.payload };
      default:
        return state;
    }
  };