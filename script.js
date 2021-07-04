'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const learnMoreButton = document.querySelector('.btn--scroll-to');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnModel => {
  btnModel.addEventListener('click', openModal)
})

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////////////////////
// page navigation starts
document.querySelector('.nav__links').addEventListener('click', function (event) {
  event.preventDefault();
  if (event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

// page navigation ends
///////////////////////////////////////////////
// scroll related things start

learnMoreButton.addEventListener('click', function (event) {
  const sec1Coords = section1.getBoundingClientRect();
  const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
  window.scrollTo({
    left: sec1Coords.left + window.pageXOffset,
    top: sec1Coords.top + window.pageYOffset,
    behavior: 'smooth'
  })
  // console.log('{current scroll position}::', window.pageXOffset, window.pageYOffset);
  // section1.scrollIntoView({
  //   behavior: 'smooth'
  // })

})
// // scroll related things end

// tab implementation starts
const tabDiv = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContentDiv = document.querySelectorAll('.operations__content')
tabDiv.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('{comign here}::', e.target);

  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // removing the classes
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active')
  })
  tabContentDiv.forEach(contentDiv => {
    contentDiv.classList.remove('operations__content--active')
  })
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})
// tab implementation ends

// fade animation on links starts
const nav = document.querySelector('.nav');

function handleMouseEvents(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav');
    const navLinks = siblings.querySelectorAll('.nav__link')
    const logo = siblings.querySelector('img');

    navLinks.forEach(navLink => {
      if (navLink !== link) {
        navLink.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleMouseEvents.bind(0.5))
nav.addEventListener('mouseout', handleMouseEvents.bind(1))
// fade animation on links ends

// fixed header starts
window.addEventListener('scroll', function () {
  // console.log('{window.scroll}::', window.scrollY, window.pageYOffset);

})
// fixed header ends
// const observerCb = function (entries, observer) {
//   console.log('{observer cb}::', entries, observer);

// }

// const observerOptions = {
//   root: null,
//   threshold: 0.1
// }
// const observer = new IntersectionObserver(observerCb, observerOptions);
// observer.observe(section1);
// sticky navigation starts
const firstHeader = document.querySelector('.header');
const { height: navHeight } = nav.getBoundingClientRect();
console.log('{heigh}::', navHeight);

const headerObserverCB = function (entries) {
  console.log('{entrie}::', entries);

  const [entry] = entries;
  (entry.isIntersecting ? nav.classList.remove('sticky') : nav.classList.add('sticky'));
}
const headerObserver = new IntersectionObserver(headerObserverCB, { root: null, threshold: 0, rootMargin: `${-navHeight}px` });
headerObserver.observe(firstHeader);
// sticky navigation ends

// hide before scroll elements start
const allSections = document.querySelectorAll('.section');

const sectionObserverCB = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(sectionObserverCB, {
  root: null,
  threshold: 0.15
})

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
})
// hide before scroll elements end

// lazy loading images start
const images = document.querySelectorAll('.lazy-img');
const imageObserverCB = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  const targetElement = entry.target;
  targetElement.src = targetElement.dataset.src;
  targetElement.addEventListener('load', function () {
    targetElement.classList.remove('lazy-img');
  })
  observer.unobserve(targetElement);
}
const imageObserver = new IntersectionObserver(imageObserverCB, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});
images.forEach(image => {
  imageObserver.observe(image);
})
// lazy loading images ends

// slider start
const slides = document.querySelectorAll('.slide');
const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');
const maxSlides = slides.length;
createDots();
goToSlide(0);

function createDots() {
  slides.forEach((slide, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dots__dot');
    if (index === 0) {
      dot.classList.add('dots__dot--active')
    }
    dots.append(dot);
    dot.dataset.slideNumber = index;
  })
}

function goToSlide(currentSlide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - currentSlide) * 100}%)`
  });
  const allDots = dots.querySelectorAll('.dots__dot');
  allDots.forEach(dot => dot.classList.remove('dots__dot--active'))
  dots.querySelector(`.dots__dot[data-slide-number="${currentSlide}"]`).classList.add('dots__dot--active');
}
let currentSlider = 0;
function nextSlide() {
  if (currentSlider === maxSlides - 1) {
    currentSlider = 0
  } else {
    currentSlider++;
  }
  goToSlide(currentSlider);
}

function prevSlide() {
  if (currentSlider === 0) {
    currentSlider = maxSlides - 1;
  } else {
    currentSlider--;
  }
  goToSlide(currentSlider);
}

buttonRight.addEventListener('click', nextSlide);
buttonLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
})



dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    goToSlide(e.target.dataset.slideNumber);
  }

})

// slider ends
// // event bubbling and capturing starts
// function generateRandomNumber(min, max) {
//   return Math.trunc(Math.random() * (max - min + 1) + min);
// }

// const randomColor = () => `rgb(${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)}, ${generateRandomNumber(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (event) {
//   console.log('{coming here in the click}::',);
//   console.log('{random color}::', randomColor());

//   this.style.backgroundColor = randomColor();
// })
// document.querySelector('.nav__links').addEventListener('click', function (event) {
//   console.log('{coming here in the click}::',);
//   console.log('{random color}::', randomColor());

//   this.style.backgroundColor = randomColor();
// })
// document.querySelector('.nav').addEventListener('click', function (event) {
//   console.log('{coming here in the click}::',);
//   console.log('{random color}::', randomColor());

//   this.style.backgroundColor = randomColor();
// })
// // event bubbling and capturing ends
