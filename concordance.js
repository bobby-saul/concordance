(function ($) {
    $(document).ready(function () {
        // Global variables
        var bible;
        var bibleObj= {};
        var perPage = 50;
        var found = [];
        var page = 0;
        var searchTerm;

        // Get text and setup object
        $.ajax({
            url : "kjv.txt",
            success : function (data) {
                var currentBook;
                var bookNum = 0;
                bible =  data.split(/[\n]+/);
                bible.forEach(function(line) {
                    if (/^[\d]+\:[\d]+/.test(line.trim())) {
                        bibleObj[bookNum].verses.push(line);
                    } else {
                        currentBook = line.trim();
                        bookNum++;
                        bibleObj[bookNum] = {
                            title: currentBook,
                            verses: []
                        };
                    }
                });
            }
        });

        function regReplace(match) {
            return "<span class='highlight'>" + match + "</span>"
        }

        function formatVerse(verse) {
            var htmlString = "<span tabindex=0 class='verse-link' data-book='" + verse[0] + "' data-verse='" + verse[1] + "'>" + verse[0] + "</span> ";

            htmlString += verse[2].replace(new RegExp("(" + searchTerm + ")", "gi"), regReplace);

            return htmlString;
        }

        function showResults() {
            var lastPage = Math.ceil(found.length / perPage) - 1;

            $(".next").removeClass("disabled");
            $(".previous").removeClass("disabled");
            if (page === 0) {
                $(".previous").addClass("disabled");
            }
            if (lastPage === page) {
                $(".next").addClass("disabled");
            }

            $(".page-count").text("Page " + (page + 1) + "/" + (lastPage + 1));
            $(".result").html("");
            $(".result").attr("start", (page * perPage + 1));
            for (var x = perPage * (page); x < (perPage * (page + 1)); x ++){
                if (x < found.length) {
                    $(".result").append("<li class='found-verse'>" + formatVerse(found[x]) + "</li>");
                } else {
                    break;
                }
            }
        }

        // search function
        function search() {
            found = []; // clear global found array
            searchTerm = $("#Search").val().toLowerCase();
            
            for ( var book in bibleObj) {
                bibleObj[book].verses.forEach(function (verse, index) {
                    if (verse.toLowerCase().indexOf(searchTerm) !== -1) {
                        found.push([
                            bibleObj[book].title,
                            index,
                            verse
                        ]);
                    }
                });
            }

            page = 0;
            showResults();
        }

        $("#Search-Button").on("click", search);
        $("#Search").on("keydown", function (event) {
            if (event.keyCode === 13) {
                search();
            }
        });
        $(".next").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                page++;
                showResults();
            }
        });
        $(".previous").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                page--;
                showResults();
            }
        });
    });
})(jQuery)