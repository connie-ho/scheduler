import React from 'react';
import classnames from 'classnames';
import './DayListItem.scss';

export default function DayListItem(props) {
  
  const dayListItemClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots,
  });

  const formatSpots = function(numSpots) {
    if (!numSpots) {
      return 'no spots remaining'
    }

    if (numSpots === 1) {
      return '1 spot remaining'
    }

    return `${numSpots} spots remaining`
  }


  return (
    <li 
    className={dayListItemClass}
    onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}