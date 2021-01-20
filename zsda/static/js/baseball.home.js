import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function GameCalendar() {
    const [value, onChange] = useState(new Date());
    return (
        <div>
            <Calendar onChange={onChange} value={value}/>
        </div>
    );
}

ReactDOM.render(
    <GameCalendar />,
    document.getElementById('calendar')
);