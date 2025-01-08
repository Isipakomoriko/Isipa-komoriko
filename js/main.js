(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Project and Testimonial carousel
    $(".project-carousel, .testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
			0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

// URL de l'API REST Countries v2
const url = 'https://restcountries.com/v2/all';

// Fonction pour charger les pays
function loadCountries() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('Nationalité');
            
            // Ajoute les pays à la liste déroulante
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.alpha3Code; // Utilisation du code pays
                option.textContent = country.name; // Nom du pays
                select.appendChild(option);
            });
            
            // Option "Autre"
            const autreOption = document.createElement('option');
            autreOption.value = "Autre";
            autreOption.textContent = "Autre";
            select.appendChild(autreOption);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des pays:', error);
            alert('Impossible de charger la liste des pays. Veuillez vérifier votre connexion.');
        });
}

// Appel de la fonction pour charger les pays au chargement de la page
document.addEventListener('DOMContentLoaded', loadCountries);
