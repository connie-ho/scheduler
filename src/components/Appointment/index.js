import React from 'react';
import useVisualMode from '../..//hooks/useVisualMode';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import './styles.scss';

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING, true) //shows saving component on click before call is made
    props.bookInterview(props.id, interview)
      .then(res => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true))

    return;
  }

  const cancel = function() {

    transition(DELETING, true)
    props.cancelInterview(props.id)
     .then(res => transition(EMPTY))
     .catch(err => transition(ERROR_DELETE, true))
      
    return;
  }

  return (
    <>
      <article className="appointment">
        <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onEdit={()=>{transition(EDIT)}}
            onDelete={()=>{transition(CONFIRM)}}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewer
            interviewers={props.interviewers} 
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && (<Status message="Saving"/>)}
        {mode === DELETING && (<Status message="Deleting"/>)}
        {mode === CONFIRM && (
          <Confirm 
            message="Are you sure you want to delete?"
            onCancel={back}
            onConfirm={cancel}
          />
        )}
        {mode === EDIT && (
          <Form 
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers} 
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error 
            onClose={back}
            message="Error editing appointment."
          />)}
        {mode === ERROR_DELETE && (
          <Error 
            onClose={back}
            message="Could not cancel appointment."
          />)}
      </article>
    </>
  );
}