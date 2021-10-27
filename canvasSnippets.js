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
    id: 'injectedFrame',
    frameborder: 0,
    scrolling: 'no',
    width: '100%',
    height: '480',
    margin: 'auto'
}).appendTo('#injectionSite');



// ==================================
// Snippet for Canvas theme JS to look for a 'glossary' page and highlight words found on a page that match the glossary content
// ==================================

//find glossary page

// new jQuery selector for 'insensitive contains' -- contains a term and doesn't care about upper/lower case
jQuery.expr[':'].icontains = function (a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

var courseID = this.ENV.COURSE_ID;
var terms = [];
var defs = [];

$.get("/api/v1/courses/" + courseID + "/pages?sort=title&order=asc", function (e) {
    var val = e.find(x => x.title === 'Glossary');
    console.log(val);
    $.get("/api/v1/courses/" + courseID + "/pages/" + val.url + "", function (urlGet) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(urlGet.body, 'text/html');
        var defList = htmlDoc.querySelector('dl');
        // find each word/definition pair
        for (let i = 0; i < defList.childNodes.length; i++) {
            if (defList.childNodes[i].nodeType != 3) {
                if (defList.childNodes[i].tagName == 'DT') {
                    terms[terms.length] = defList.childNodes[i].innerText;

                }
                if (defList.childNodes[i].tagName == 'DD') {
                    defs[defs.length] = defList.childNodes[i].innerText;

                }
            }
        }

        // try to find the first instance of each word in `glossary` and wrap the term in HTML
        console.log("Testing finding biz");
        for (let i = 0; i < terms.length; i++) {
            var termFound = $(".show-content:icontains('" + "" + terms[i] + "" + "')");
            var newText = termFound.html().replace(new RegExp('(' + terms[i] + ')', 'ig'),
                '<span class="tooltip">$1<span class="tooltiptext">' + defs[i] + '</span></span>');
            termFound.html(newText);
        }
    });
});