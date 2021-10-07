
// ==================================
// Snippet for Canvas theme JS to inject an iFrame that can pass through the student, course and week data.
// ==================================

let userID = this.ENV.current_user_id; //grab the de-identified Canvas API ID for the user
let courseID = this.ENV.COURSE_ID; //grab the current course

// grab the current week too? Or can we chuck that into the div?
let currentWeek = $("#injectionSite").attr("data-week");

// create base url; we then build upon this with paramaters.

let BASE_URL = "https://uamediaprod.github.io/shared-content/check-in/";
let param;

param = "?student=" + userID + "&" + "course=" + courseID + "&" + "week=" + currentWeek;

console.log(BASE_URL + param);

// create iframe and inject iframe into injectionSite

$('<iframe>', {
    src: BASE_URL + param,
    id:  'injectedFrame',
    frameborder: 0,
    scrolling: 'no',
    width: '100%',
    height: '480',
    margin: 'auto'
    }).appendTo('#injectionSite');
