// Hamburger menu
$("#dropdown-toggle").click( function () {
    $('.profile-dropdown').toggleClass("dropdown-active");
    $('.fa-angle-down').toggleClass('rotate-active');
})

$("#mobile-menu-bar").click( function () {
    $('.nav-links').toggleClass("mobile");
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


// Loading more articles button 

$(".load-more").on("click", function() {
    $(".blog-card:hidden").slice(0, 4).show();
    if ($(".blog-card:hidden").length ==0) {
        $(".load-more").fadeTo("fast", 0.3);
    }
});

//free e-guide modal 

$(".modal-btn").on("click", function() {
    $(".modal-bg").addClass("bg-active");
});
$(".modal-close").on("click", function() {
    $(".modal-bg").removeClass("bg-active");
});
// $(document).click(function(event) {
//     //if you click on anything except the modal itself or the "open modal" link, close the modal
//     if (!$(event.target).closest(".modal,.modal-btn").length) {
//       $("body").find(".modal-bg").removeClass("bg-active");
//     }
//   });



// newsletter modal after course purchased

$(".course-purchased-btn").on("click", function() {
    $(".modal-bg").addClass("bg-active");
});
$(".modal-close").on("click", function() {
    $(".modal-bg").removeClass("bg-active");
});

//newsletter modal after footer link clicked 

$(".newsletter-join-btn").on("click", function() {
    $(".newsletter-modal-bg").addClass("bg-active");
});
$(".modal-close").on("click", function() {
    $(".newsletter-modal-bg").removeClass("bg-active");
});

//blog modal within blog posts

$(".blog-newsletter-btn").on("click", function() {
    $(".blog-modal-bg").addClass("bg-active");
});
$(".modal-close").on("click", function() {
    $(".blog-modal-bg").removeClass("bg-active");
});
