import { ACTIVATE_VARIATION } from './variations';

const initialstate = {headline: 'How do you want to get Showtime?'}

export const headline = (state = initialstate, action={}) => {
  switch (action.type) {
    case ACTIVATE_VARIATION:
      if (action.payload.headline) {
        const headline = action.payload.headline
        return { ...state, headline }
      } else {
        return state
      }
    default:
      return state;
  }
}