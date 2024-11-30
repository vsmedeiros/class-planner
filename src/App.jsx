import { useState } from "react";
import "./App.css";
import classData from "./classData.json";

function App() {
  const [schedule, setSchedule] = useState({});

  function isTimeInRange(time1, time2) {
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }

    const [start1, end1] = time1.split(" - ").map(timeToMinutes);
    const [start2, end2] = time2.split(" - ").map(timeToMinutes);

    return start1 >= start2 && end1 <= end2;
  }

  const handleSelectionChange = (selectedDay, selectedTime, value) => {
    if (!value) return;
    console.log(`${selectedDay}-${selectedTime}`);
    const classWithConflict = getScheduleValue(
      `${selectedDay}-${selectedTime}`
    );
    if (classWithConflict) {
      for (const key of Object.keys(schedule)) {
        if (schedule[key] === classWithConflict) {
          delete schedule[key];
        }
      }
    }
    const [code, className] = value.split("-");

    const selectedClass = classData.find(
      (course) => course.code === code && course.class === className
    );

    if (selectedClass) {
      const updatedSchedule = { ...schedule };

      selectedClass.schedules.forEach(({ day, time }) => {
        updatedSchedule[`${day}-${time}`] = `${code}-${className}`;
      });

      setSchedule(updatedSchedule);
    }
  };

  function getScheduleValue(dayTime) {
    const [day, ...time] = dayTime.split("-");
    const [startTime, endTime] = time;
    for (const key of Object.keys(schedule)) {
      const [keyDay, ...keyTime] = key.split("-");
      const [keyStartTime, keyEndTime] = keyTime;

      if (
        day === keyDay &&
        isTimeInRange(
          `${startTime} - ${endTime}`,
          `${keyStartTime} - ${keyEndTime}`
        )
      ) {
        return schedule[key];
      }
    }

    return "";
  }
  function getClassColor(courseCode) {
    const course = classData.find((course) => course.code === courseCode);
    return course ? course.color : "white";
  }
  console.log(schedule);
  return (
    <>
      <h1>CLASS PLANNER</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>HORÁRIO</th>
              <th>SEGUNDA-FEIRA</th>
              <th>TERÇA-FEIRA</th>
              <th>QUARTA-FEIRA</th>
              <th>QUINTA-FEIRA</th>
              <th>SEXTA-FEIRA</th>
              <th>SÁBADO</th>
            </tr>
          </thead>
          <tbody>
            {[
              "14:00 - 14:50",
              "14:50 - 15:40",
              "19:00 - 19:50",
              "19:50 - 20:40",
              "20:50 - 21:40",
              "21:40 - 22:30",
            ].map((hour) => (
              <tr key={hour}>
                <td>{hour}</td>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => {
                  const selectedClassValue = getScheduleValue(`${day}-${hour}`);
                  const classColor = getClassColor(
                    selectedClassValue.split("-")[0]
                  );
                  return (
                    <td
                      key={`${day}-${hour}`}
                      style={{ backgroundColor: classColor }}
                    >
                      <select
                        style={{ backgroundColor: classColor }}
                        value={selectedClassValue}
                        onChange={(e) =>
                          handleSelectionChange(day, hour, e.target.value)
                        }
                      >
                        <option value="" style={{ backgroundColor: "white" }}>
                          Selecione a matéria
                        </option>
                        {classData
                          .filter((course) =>
                            course.schedules.some(
                              (schedule) =>
                                schedule.day === day &&
                                isTimeInRange(hour, schedule.time)
                            )
                          )
                          .map((subject) => (
                            <option
                              style={{ backgroundColor: "white" }}
                              key={`${subject.code}-${subject.class}`}
                              value={`${subject.code}-${subject.class}`}
                            >
                              {subject.code} - {subject.course} -{" "}
                              {subject.class}
                            </option>
                          ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
