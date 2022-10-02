//hamburger menu

var burger = document.getElementById('mobile-menu-bar');
var menu = document.getElementById('mobile-nav')
burger.addEventListener('click', function() {
    menu.classList.toggle("mobile");
});

//dropdown mnenu 

var dropdown_title = document.getElementById('dropdown-toggle');
var dropdown = document.getElementById("profile-dropdown");
dropdown_title.addEventListener('click', function() {
    dropdown.classList.toggle("dropdown-active");
})


// FAQ dropdown menu

const questions = document.querySelectorAll('.question-answer');

questions.forEach(function(question) {
    const btn = question.querySelector('.question');
    btn.addEventListener("click", function() {
        questions.forEach(function(item) {
            if (item!== question) {
                item.classList.remove("show-text");
            }
        })
        question.classList.toggle('show-text');
    });
});


