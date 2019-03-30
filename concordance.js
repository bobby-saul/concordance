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
        function getBibleText() {
            var bibleText = $("#version").val();
            $.ajax({
                url : bibleText,
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
        }
        getBibleText();

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

            $(".search-next").removeClass("disabled");
            $(".search-previous").removeClass("disabled");
            if (page === 0) {
                $(".search-previous").addClass("disabled");
            }
            if (lastPage === page) {
                $(".search-next").addClass("disabled");
            }

            $(".search-current-page").val(page + 1);
            $(".search-current-page").attr("max", lastPage + 1);
            $(".search-total-pages").text(lastPage + 1);
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

        // change per page
        function changePerPage () {
            perPage = parseInt($("#per-page").val());
            showResults();
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
            $(".search-results").attr("open", true);
            showResults();
        }

        $("#version").on("change", getBibleText);
        $("#per-page").on("change", changePerPage);
        $("#Search-Button").on("click", search);
        $("#Search").on("keydown", function (event) {
            if (event.keyCode === 13) {
                search();
            }
        });
        $(".search-next").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                page++;
                showResults();
            }
        });
        $(".search-previous").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                page--;
                showResults();
            }
        });
        $(".search-current-page").on("change", function(e) {
            page = parseInt($(this).val()) - 1;
            showResults();
        })
    });
})(jQuery)