import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { toPng } from "html-to-image";
// import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const CalendarWithBeautifiedStyles = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  // Departments and their pastel color codes
  const departments = {
    IT: "linear-gradient(135deg, #FFC1C1, #FFA3A3)", // Coral to deeper coral
    HR: "linear-gradient(135deg, #FFDEA5, #FFD685)", // Apricot to deeper apricot
    Finance: "linear-gradient(135deg, #D6D6F5, #BEBEE8)", // Lavender to deeper lavender
    Product: "linear-gradient(135deg, #A2D9FF, #81C7F2)", // Sky blue to deeper blue
    Communications: "linear-gradient(135deg, #FAF3DD, #F5E7A7)", // Vanilla cream to light yellow
    CaseManagement: "linear-gradient(135deg, #B8F5D3, #8FEFC1)", // Mint green to deeper green
    BDD: "linear-gradient(135deg, #FFF6A3, #FDE780)", // Yellow to deeper yellow
    Networking: "linear-gradient(135deg, #C9B6E4, #A889D3)", // Lilac to deeper purple
    TAP: "linear-gradient(135deg, #FFC9C7, #FFA9A8)", // Rose quartz to deeper pink
    Hijri: "linear-gradient(135deg, #F7DC6F, #EBC65E)", // Gold to deeper gold
    OperationsCoordination: "linear-gradient(135deg, #DAF5FA, #AEE9F2)", // Aqua to deeper blue
    TR_Website: "linear-gradient(135deg, #EFD6EC, #D4A3D0)", // Pink lavender to deeper magenta
    PMO: "linear-gradient(135deg, #D4F1F4, #B0E0E3)", // Ice blue to deeper teal
  };

  const weekdays = [
    "Sun يوم الأحد", 
    "Mon يوم الإثنين", 
    "Tue يوم الثلاثاء", 
    "Wed يوم الأربعاء", 
    "Thu يوم الخميس", 
    "Fri يوم الجمعة", 
    "Sat يوم السبت"];
  // Fetch event data from local file
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/events.json"); 
        // File in public folder
        if (!response.ok) {
          throw new Error("Failed to load events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleGoToDate = (date) => setSelectedDate(new Date(date));

  const getEventsForDay = (day) => {
    const dayKey = format(day, "yyyy-MM-dd");
    return events.filter((event) => event.date === dayKey);
  };

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   const calendarElement = document.getElementById("calendar");

  //   doc.html(calendarElement, {
  //     callback: function (doc) {
  //       doc.save("calendar.pdf");
  //     },
  //     x: 10,
  //     y: 10,
  //     width: 190,
  //     windowWidth: 800,
  //   });
  // };


//   const exportToPDF = () => {
//     const calendarElement = document.getElementById("calendar");

//     html2canvas(calendarElement, {
//         scale: 4, // Increase scale for better quality
//         useCORS: true, // Allow cross-origin content
//     }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png", 1.0); // Convert canvas to image data
//         const pdf = new jsPDF({
//             orientation: "portrait",
//             unit: "pt",
//             format: "a4",
//         });

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save("calendar.pdf");
//     }).catch((error) => {
//         console.error("Error exporting to PDF:", error);
//     });
// };
  const exportToImage = () => {
  const calendarElement = document.getElementById("calendar");
  const exportButton = document.getElementById("export-button"); // Add an ID to the export button

  if (!calendarElement) return;

  // Temporarily hide the export button
  if (exportButton) {
    exportButton.style.display = "none"; // Hide the export button
  }

  // Generate the image
  toPng(calendarElement, { quality: 0.95 })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "calendar.png";
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => console.error("Failed to export image:", error))
    .finally(() => {
      // Restore the export button's visibility after the image is generated
      if (exportButton) {
        exportButton.style.display = "block"; // Show the export button
      }
    });
  //
  return (
  <div id="calendar">
    <div className="calendar-container">
      {/* Header */}
      <header className="calendar-header">
        <button className="nav-btn" onClick={handlePrevMonth}>
          &lt;
        </button>
        <h2 className="month-title">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button className="nav-btn" onClick={handleNextMonth}>
          &gt;
        </button>
      </header>

      {/* Weekdays */}
      <div className="calendar-grid weekdays">
        {weekdays.map((weekday) => {
          // const [english, arabic] = weekday.split(" ", 2); // Split the string into Arabic and English parts
          // Find the first space to split English and Arabic
          const firstSpaceIndex = weekday.indexOf(" ");
          const english = weekday.substring(0, firstSpaceIndex); // Text before the first space
          const arabic = weekday.substring(firstSpaceIndex + 1); // Text after the first space
          return (
            <div key={weekday} className="weekday">
              <div className="arabic">{arabic}</div>
              <div className="english">{english}</div>
            </div>
          );
        })}
      </div>
      {/* <div className="calendar-grid weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday} className="weekday">
            {weekday}
          </div>
        ))}
      </div> */}

      {/* Days */}
      <div className="calendar-grid days">
        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`day ${
                format(day, "MM") !== format(currentMonth, "MM") ? "outside" : ""
              } ${isToday(day) ? "today" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              <span>{format(day, "d")}</span>
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={`event department ${event.department}`}
                  // className="event"
                  // style={{ backgroundColor: departments[event.department] }}
                >
                  {event.event}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      
      {/* Selected Date Details */}
      {/* {selectedDate && (
        <div className="selected-date">
          <h3>Selected Date: {format(selectedDate, "yyyy-MM-dd")}</h3>
          <ul>
            {getEventsForDay(selectedDate).map((event, idx) => (
              <li key={idx}>
                <span
                  style={{
                    color: departments[event.department],
                  }}
                >
                  {event.department}
                </span>
                : {event.event}
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Department Legend */}
      <div className="department-legend">
        <h4>Department Legend:</h4>
        <ul className="department-list">
          {Object.entries(departments).map(([department, color]) => (
            <li key={department} style={{ color: color }}>
              <span className={`legend-dot ${department}`}></span>
              {/* <span className="legend-dot" style={{ backgroundColor: color }}></span> */}
              {department}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="actions">
        {/* <button className="nav-btn" onClick={exportToPDF}>
          Export to PDF
        </button> */}
        <button className="nav-btn" onClick={exportToImage}>
          Export to Image
        </button>
      </div>
      </div> 
  );
};

export default CalendarWithBeautifiedStyles;
