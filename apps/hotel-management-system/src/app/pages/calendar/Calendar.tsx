import React, { useState } from 'react';

export const Calendar = () => {
    
    function DynamicMonths(){
        const monthNames = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        for (let i = 0; i < monthNames.length; ++i)
            document.write(monthNames[i]);
    }

    function MakeCalendar(){
        
    }
    
        return (
            <div>
                <h1>Calendar Section</h1>
                
                <table>
                    <button>
                        Back
                    </button>                    
                    <th>
                        "Month"
                    </th>
                    <button>
                        Next
                    </button>
                        <tr>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                            <th>Sun</th>    
                        </tr>    
                </table>
            </div>
        )
};
