const navbar = document.querySelector('nav'),
otherButtonLeft = document.getElementById('self_switchOtherButton_left'),
otherButtonRight = document.getElementById('self_switchOtherButton_right'),
otherContainer = document.getElementById('self_otherContainer'),
games = document.querySelectorAll('.self_otherGame'),
welcomeElements = document.querySelectorAll(".self_welcomeAnimationEl");

window.onscroll = function() {
    if (window.scrollY > 1) {
        navbar.classList.add('bg-body-secondary');
    } else {
        navbar.classList.remove('bg-body-secondary');
    }
}

function welcomeAnim() {
    setTimeout(() => {
        welcomeElements.forEach(elem => {
            elem.style.opacity = 1;
        })
    }, 500);
}

let activeGame = 0;

function toggleGames(isBackwards) {
    otherButtonLeft.toggleAttribute('disabled', activeGame == 0);
    otherButtonRight.toggleAttribute('disabled', activeGame == (games.length - 1))
    if (activeGame > 0) {games[(activeGame - 1)].classList.remove('self_otherActive')}
    if (isBackwards == true) {games[(activeGame + 1)].classList.remove('self_otherActive');}
    games[activeGame].classList.add('self_otherActive');
}

otherButtonLeft.addEventListener('click', () => {
    activeGame -= 1;
    toggleGames(true);
})

otherButtonRight.addEventListener('click', () => {
    activeGame += 1;
    toggleGames();
})

window.onload = function() {
    welcomeAnim();
    toggleGames();

    // Fade-in on scroll
    const fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeEls.forEach(el => observer.observe(el));
    } else {
        fadeEls.forEach(el => el.classList.add('visible'));
    }
}