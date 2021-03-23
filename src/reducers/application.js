import { getAppointmentsForDay } from "../helpers/selectors";

// const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS";

function updateSpots(id, state){ 
  // pass in prev state and appointment id to update that day's spots
  // pass in prev state as old state wouldn't have updated with the current appointments data yet

  let dayIndex = 0;
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].appointments.find(elem => elem === id)) {
      dayIndex = i;
    }
  }

  const dailyAppointments = getAppointmentsForDay(state, state.days[dayIndex].name);

  let count = dailyAppointments.length;

  for(const appointment of dailyAppointments) {
    if(appointment.interview){
      count -= 1
    }
  }

  const day = {
    ...state.days[dayIndex],
    spots: count
  };

  const days = [...state.days];
  days[dayIndex] = day;

  return days
}

export default function reducer(state, action) {

  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.day};
    case SET_APPLICATION_DATA:
      return {
        ...state, 
        days: action.days, 
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case SET_INTERVIEW: 
      return {...state, appointments: action.appointments};
    case SET_SPOTS:
      return {...state, days: updateSpots(action.id, state)}
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }

}

export {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_SPOTS,
  updateSpots
}
