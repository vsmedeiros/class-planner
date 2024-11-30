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
  function getClass(courseCode, classCode) {
    const course = classData.find(
      (course) => course.code === courseCode && course.class === classCode
    );
    return course;
  }
  const scheduleCodes = new Set(Object.values(schedule));
  function handleDelete(course) {
    const updatedSchedule = { ...schedule };
    for (const key in schedule) {
      if (schedule[key].includes(course)) {
        delete updatedSchedule[key];
      }
    }
    setSchedule(updatedSchedule);
  }
  return (
    <>
      <h1>CLASS PLANNER</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>HORÁRIO</th>
              <th>MONDAY</th>
              <th>TUESDAY</th>
              <th>WEDNESDAY</th>
              <th>THURSDAY</th>
              <th>FRIDAY</th>
              <th>SATURDAY</th>
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
                  const classColor =
                    getClass(
                      selectedClassValue.split("-")[0],
                      selectedClassValue.split("-")[1]
                    )?.color || "white";
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
        {Object.keys(schedule).length > 0 && (
          <div className="schedule">
            <h2>SCHEDULE</h2>
            <table>
              <thead>
                <tr>
                  <th>CODE/CLASS</th>
                  <th>COURSE</th>
                  <th>TEACHER</th>
                  <th>DAY/TIME</th>
                  <th>PREREQUISITE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...scheduleCodes].map((code) => {
                  const [courseCode, classCode] = code.split("-");
                  const currentCourse = getClass(courseCode, classCode);
                  return (
                    <tr
                      key={code}
                      style={{
                        backgroundColor: currentCourse.color,
                      }}
                    >
                      <td>{code}</td>
                      <td>{currentCourse.course}</td>
                      <td>
                        {currentCourse.teacher} - {currentCourse.email}
                      </td>
                      <td>
                        {currentCourse.schedules
                          .map(({ day, time }) => `${day} - ${time}`)
                          .join(", ")}
                      </td>
                      <td>{currentCourse.prerequisite || "-"} </td>
                      <td>
                        <button
                          onClick={() =>
                            handleDelete(
                              `${currentCourse.code}-${currentCourse.class}`
                            )
                          }
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
