console.log("Cookie reader from web app");
console.log(document.cookie);
var cookieName = 'layoutCookie';
var cookieValue = 'layoutCookie';
var myDate = new Date();
myDate.setMonth(myDate.getMonth() + 12);
document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate 
                + ";domain=.charitableimpact.com;path=/";