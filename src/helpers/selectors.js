export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const res = [];

  const filteredDay = state.days.filter(stateDay => stateDay.name === day)
  
  if(!filteredDay.length) {
    return res;
  }

  for (const elem of filteredDay[0].appointments){
    res.push(state.appointments[elem])
  }
  
  return res;
}

export function getInterview(state, interview) {

  if (!interview) return null;

  const interviewer = state.interviewers[interview.interviewer];

  const res = {
    student: interview.student,
    interviewer: interviewer
  }

  return res;

}

export function getInterviewersForDay(state, day) {
  //... returns an array of appointments for that day
  const res = [];

  const filteredDay = state.days.filter(stateDay => stateDay.name === day)
  if(!filteredDay.length) {
    return res;
  }

  for (const elem of filteredDay[0].interviewers){
    res.push(state.interviewers[elem])
  }
  
  return res;
}