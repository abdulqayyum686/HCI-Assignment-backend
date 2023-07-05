module.exports.getCurrentDateAndTime = async () => {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  let currentDate = year + "-" + month + "-" + date;
  let currentTime = hours + ":" + minutes + ":" + seconds;
  console.log("currentDate", currentDate);
  console.log("currentTime", currentTime);

  console.log(hours + ":" + minutes);
  return { currentDate, currentTime };
};
