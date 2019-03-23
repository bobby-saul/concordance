var bible;
var bibleArr = [];
var verses = [];
var books = [];
(function ($) {
    $(document).ready(function () {
        // var bible;
        // var bibleArr = [];
        // var verses = [];
        // var books = [];
        $.ajax({
            url : "working2.txt",
            success : function (data) {
                bible = data;
                // bible = data.replace(/\r/g, "").replace(/(\w)([\n])(\w)/g, "$1 $3");
                // $('#Bible').html(bible);
                // bibleArr = bible.split(/[\n]+/);
                // bibleArr.forEach(function(line) {
                //     if (/^[\d]+\:[\d]+/.test(line.trim())) {
                //         verses.push(line);
                //     } else {
                //         books.push(line);
                //     }
                // });
            }
        });
    });
})(jQuery)