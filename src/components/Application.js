import React, { useState } from "react";

import DayList from "./DayList"
import Appointment from "./Appointment"
import "components/Application.scss";

const days = [
  {
    id: 1,
    name: "Monday",
    spots: 2,
  },
  {
    id: 2,
    name: "Tuesday",
    spots: 5,
  },
  {
    id: 3,
    name: "Wednesday",
    spots: 0,
  },
];

const appointmentData = [
  {
    id: 1,
    time: "12pm"
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Connie Ho",
      interviewer: { id: 2, name: "Tori Malcolm", avatar: "https://i.imgur.com/Nmx0Qxo.png" }
    }
  },
  {
    id: 3,
    time: "3pm",
    interview: {
      student: "Justin Ly",
      interviewer: { id: 3, name: "Mildred Nazir", avatar: "https://i.imgur.com/T2WwVfS.png" }
    }
  },
  {
    id: 4,
    time: "4pm",
    interview: {
      student: "Chen Liang",
      interviewer: { id: 4, name: "Cohana Roy", avatar: "https://i.imgur.com/FK8V841.jpg" }
    }
  },
  {
    id: 5,
    time: "5pm",
    interview: {
      student: "Amy Mansell",
      interviewer: { id: 5, name: "Sven Jones", avatar: "https://i.imgur.com/twYrpay.jpg" }
    }
  }
];


export default function Application(props) {

  const [day, setDay] = useState("Monday")

  const appointments = appointmentData.map(appointment => {
    return <Appointment key={appointment.id} {...appointment}/>
  })

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={days}
          day={day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {appointments}
      </section>
    </main>
  );
}
