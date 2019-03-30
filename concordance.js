(function ($) {
    $(document).ready(function () {
        // Global variables
        var bible;
        var bibleObj= {};
        var perPage = 50;
        var found = [];
        var searchPage = 0;
        var searchTerm;
        var readerBook = 1;
        var readerPage = 0;

        // function to add all books to reader
        function bookSelectPopulate() {
            for (var bookIndex in bibleObj) {
                $("#book").append("<option value='" + bookIndex + "'>" + bibleObj[bookIndex].title + "</option>");
            }
        }

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
                    bookSelectPopulate();
                    showReader();
                }
            });
        }

        // function to highlight words in search
        function regReplace(match) {
            return "<span class='highlight'>" + match + "</span>"
        }

        // function format verse for search
        function formatVerse(verse) {
            var htmlString = "<span tabindex=0 class='verse-link' data-book='" + verse[0] + "' data-verse='" + verse[1] + "'>" + verse[2] + "</span> ";

            htmlString += verse[3].replace(new RegExp("(" + searchTerm + ")", "gi"), regReplace);

            return htmlString;
        }

        // function update search results
        function showResults() {
            var lastPage = Math.ceil(found.length / perPage) - 1;
            if (searchPage > lastPage) {
                searchPage = lastPage;
            }
            if (searchPage < 0){
                searchPage = 0;
            }

            $(".search-next").removeClass("disabled");
            $(".search-previous").removeClass("disabled");
            if (searchPage === 0) {
                $(".search-previous").addClass("disabled");
            }
            if (lastPage === searchPage) {
                $(".search-next").addClass("disabled");
            }

            $(".search-current-page").val(searchPage + 1);
            $(".search-current-page").attr("max", lastPage + 1);
            $(".search-total-pages").text(lastPage + 1);
            $(".result").html("");
            $(".result").attr("start", (searchPage * perPage + 1));
            for (var x = perPage * (searchPage); x < (perPage * (searchPage + 1)); x ++){
                if (x < found.length) {
                    $(".result").append("<li class='found-verse'>" + formatVerse(found[x]) + "</li>");
                } else {
                    break;
                }
            }
            // set function for the verse links
            $(".verse-link").on("click", function() {
                var bookIndex = $(this).data("book");
                var verseIndex = $(this).data("verse");

                // set book
                $("#book").val(parseInt(bookIndex));
                readerBook = parseInt(bookIndex);

                // set page to have verse
                var pageIndex = Math.floor(parseInt(verseIndex / perPage));
                readerPage = pageIndex;

                showReader();
            })
        }

        // function update reader text
        function showReader() {
            var readerText = bibleObj[readerBook].verses;
            var lastPage = Math.ceil(readerText.length / perPage) - 1;
            if (readerPage > lastPage) {
                readerPage = lastPage;
            }
            if (readerPage < 0) {
                readerPage = 0;
            }

            $(".reader-next").removeClass("disabled");
            $(".reader-previous").removeClass("disabled");
            if (readerPage === 0) {
                $(".reader-previous").addClass("disabled");
            }
            if (lastPage === readerPage) {
                $(".reader-next").addClass("disabled");
            }

            $(".reader-current-page").val(readerPage + 1);
            $(".reader-current-page").attr("max", lastPage + 1);
            $(".reader-total-pages").text(lastPage + 1);
            $(".text").html("");
            for (var x = perPage * (readerPage); x < (perPage * (readerPage + 1)); x ++){
                if (x < readerText.length) {
                    $(".text").append("<div class='reader-verse'>" + readerText[x].replace(new RegExp("(" + searchTerm + ")", "gi"), regReplace) + "</div>");
                } else {
                    break;
                }
            }
        }

        // function change per page
        function changePerPage () {
            perPage = parseInt($("#per-page").val());
            showResults();
            showReader();
        }

        // function change the book
        function changeBook () {
            readerBook = parseInt($("#book").val());
            readerPage = 0;
            showReader();
        }

        // search function
        function search() {
            found = []; // clear global found array
            searchTerm = $("#Search").val().toLowerCase();
            
            for ( var book in bibleObj) {
                bibleObj[book].verses.forEach(function (verse, index) {
                    if (verse.toLowerCase().indexOf(searchTerm) !== -1) {
                        found.push([
                            book,
                            index,
                            bibleObj[book].title,
                            verse
                        ]);
                    }
                });
            }

            searchPage = 0;
            $(".search-results").attr("open", true);
            showResults();
            showReader();
        }

        getBibleText();
        $("#version").on("change", getBibleText);
        $("#per-page").on("change", changePerPage);
        $("#book").on("change", changeBook);
        $("#Search-Button").on("click", search);
        $("#Search").on("keydown", function (event) {
            if (event.keyCode === 13) {
                search();
            }
        });
        $(".search-next").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                searchPage++;
                showResults();
            }
        });
        $(".search-previous").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                searchPage--;
                showResults();
            }
        });
        $(".search-current-page").on("change", function(e) {
            searchPage = parseInt($(this).val()) - 1;
            showResults();
        })
        $(".reader-next").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                readerPage++;
                showReader();
            }
        });
        $(".reader-previous").on("click", function(e) {
            if (!$(this).hasClass("disabled")) {
                readerPage--;
                showReader();
            }
        });
        $(".reader-current-page").on("change", function(e) {
            readerPage = parseInt($(this).val()) - 1;
            showReader();
        })
    });
})(jQuery)