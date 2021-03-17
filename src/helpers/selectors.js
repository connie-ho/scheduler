export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const res = [];

  if(!state.days.length) {
    return res;
  }

  const filteredDay = state.days.filter(stateDay => stateDay.name === day)
  if(!filteredDay.length) {
    return res;
  }

  for (const elem of filteredDay[0].appointments){
    res.push(state.appointments[elem])
  }
  
  // console.log(res)
  return res;
}