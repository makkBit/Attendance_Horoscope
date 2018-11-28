
const studentname = document.getElementById('studentname').innerHTML;
console.log(studentname);

$.get("http://localhost:3000/students?name="+studentname, function (data) {
    const d = data[0]
    totalclasses = d.totalclasses;
    totalattended = d.totalattended;
    classperday = d.classperday;
    let currAttendance = Math.round((totalattended / totalclasses) * 100);
    let classRequired = Math.round((3 * totalclasses) - (4 * totalattended));
    let daysRequired = Math.round(classRequired / classperday);
    $("#details").append(`<p> Your Current Attendance is: ${currAttendance}% </p>`);
    $("#details").append(`<p> Your Required Attendance is: 75% </p>`);
    $("#details").append(`<p> Number of days required to reach required attendance: ${daysRequired} </p>`);
    $("#details").append(`<p> Number of classes required to reach required attendance: ${classRequired} </p>`);
});