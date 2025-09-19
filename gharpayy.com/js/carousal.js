function scrollTrack(direction) {
    const track = document.querySelector('.photo-track');
    const scrollAmount = 300;
    if (direction === 'left') {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function scrollTrack2(){
    const track = document.querySelector('.photo-track');
    const scrollAmount = 270;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.photo-track-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollTrack2();
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.5 }); 
    observer.observe(section);
});

