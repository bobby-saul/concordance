var bible;
var bibleObj= {};
(function ($) {
    $(document).ready(function () {
        $.ajax({
            url : "kjv.txt",
            success : function (data) {
                var currentBook;
                var bookNum = 0;
                bible =  data.split(/[\n]+/);
                bible.forEach(function(line) {
                    if (/^[\d]+\:[\d]+/.test(line.trim())) {
                        bibleObj[bookNum + " " + currentBook].push(line);
                    } else {
                        currentBook = line.trim();
                        bookNum++;
                        bibleObj[bookNum + " " + currentBook] = [];
                    }
                });
            }
        });
    });
})(jQuery)