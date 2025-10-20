import './style.css'
import { animate, inView } from 'motion'
// Import resume asset so Vite processes and serves it reliably
import resumeUrl from './assets/FE_Ahmar_Jamil _Resume.pdf'

// On-view animations are handled via inView below; scroll-tied fades removed for readability

// Stagger hero content
const heroEls = document.querySelectorAll('section:first-of-type .gradient-border > *, section:first-of-type .btn-primary, section:first-of-type .btn-outline')
if (heroEls.length) {
  animate(heroEls, { opacity: [0, 1], y: [10, 0] }, { duration: 0.6, delay: 0.1, stagger: 0.08, easing: 'ease-out' })
}

// Scroll progress bar
const progressEl = document.getElementById('progress')
if (progressEl) {
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? scrollTop / docHeight : 0
    progressEl.style.transform = `scaleX(${progress})`
  }
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
}

// Animate only section titles (not card content) to avoid readability delays
inView('.section-title', ({ target }) => {
  animate(target, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, easing: 'ease-out' })
}, { margin: '-10% 0px -10% 0px' })

// Theme toggle with persistence
const themeBtn = document.getElementById('theme-toggle')
const themeBtnMobile = document.getElementById('theme-toggle-mobile')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const storedTheme = localStorage.getItem('theme')
const isDark = storedTheme ? storedTheme === 'dark' : prefersDark
document.documentElement.classList.toggle('dark', isDark)
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  })
}
if (themeBtnMobile) {
  themeBtnMobile.addEventListener('click', () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  })
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle')
const mobileNav = document.getElementById('mobile-nav')
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('hidden') === false
    menuToggle.setAttribute('aria-expanded', String(open))
  })
  // Close on nav link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.add('hidden')
    menuToggle.setAttribute('aria-expanded', 'false')
  }))
}

// Scroll spy for nav links
const navLinks = Array.from(document.querySelectorAll('a.nav-link'))
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)

const onScrollSpy = () => {
  const y = window.scrollY + 100
  let activeId = ''
  sections.forEach(sec => {
    if (sec.offsetTop <= y && sec.offsetTop + sec.offsetHeight > y) {
      activeId = '#' + sec.id
    }
  })
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === activeId
    link.classList.toggle('active', isActive)
  })
}
window.addEventListener('scroll', onScrollSpy, { passive: true })
window.addEventListener('resize', onScrollSpy)
onScrollSpy()

// Ensure hero buttons are clickable: no preventDefault anywhere; add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')
    if (id && id.startsWith('#') && id.length > 1) {
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
})

// Wire resume download link
const resumeAnchor = document.getElementById('cta-resume')
if (resumeAnchor) {
  resumeAnchor.setAttribute('href', resumeUrl)
  resumeAnchor.setAttribute('download', '')
}

// Simple hero carousel (screenshots). Replace placeholders once screenshots are added
const heroCarousel = document.getElementById('hero-carousel')
const dotsContainer = document.getElementById('hero-carousel-dots')
if (heroCarousel && dotsContainer) {
  const slides = [
    { src: '/src/assets/image.png', alt: 'Project 1' },
    { src: '/src/assets/image-1.png', alt: 'Project 2' },
    { src: '/src/assets/image-2.png', alt: 'Project 3' },
  ]

  // Build slides
  heroCarousel.innerHTML = slides
    .map((s, i) => `<div class="slide ${i === 0 ? 'active' : ''}"><img src="${s.src}" alt="${s.alt}"/></div>`) // eslint-disable-line
    .join('')

  // Build dots
  dotsContainer.innerHTML = slides
    .map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" aria-label="Go to slide ${i + 1}"></button>`) // eslint-disable-line
    .join('')

  const slideEls = Array.from(heroCarousel.querySelectorAll('.slide'))
  const dotEls = Array.from(dotsContainer.querySelectorAll('.dot'))
  let current = 0

  function show(idx) {
    slideEls.forEach((el, i) => el.classList.toggle('active', i === idx))
    dotEls.forEach((el, i) => el.classList.toggle('active', i === idx))
    current = idx
  }

  // Autoplay
  let timer = setInterval(() => show((current + 1) % slides.length), 3500)

  // Interactions
  dotEls.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(timer)
    show(i)
    timer = setInterval(() => show((current + 1) % slides.length), 3500)
  }))

  // Swipe (basic)
  let startX = 0
  heroCarousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX }, { passive: true })
  heroCarousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX
    const dx = endX - startX
    if (Math.abs(dx) > 40) {
      clearInterval(timer)
      const next = dx < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length
      show(next)
      timer = setInterval(() => show((current + 1) % slides.length), 3500)
    }
  })
}

// Simple tilt on project cards
function attachTilt(cards) {
  cards.forEach(card => {
    card.classList.add('tilt')
    const handle = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rx = ((y / rect.height) - 0.5) * -8
      const ry = ((x / rect.width) - 0.5) * 8
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    card.addEventListener('mousemove', handle)
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    })
  })
}
attachTilt(document.querySelectorAll('#projects .card'))

// Render projects dynamically
async function renderProjects() {
  try {
    const res = await fetch('/src/assets/projects.json')
    if (!res.ok) return
    const projects = await res.json()
    const grid = document.getElementById('projects-grid')
    if (!grid) return
    grid.innerHTML = projects.map(p => `
      <div class="card p-5 group">
        <h3 class="font-semibold">${p.title}</h3>
        <p class="text-sm text-neutral-500">${p.meta}</p>
        <p class="mt-2 text-sm">${p.description}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${p.tags.map(t => `<span class=\"chip\">${t}</span>`).join('')}
        </div>
      </div>
    `).join('')
    attachTilt(grid.querySelectorAll('.card'))
  } catch {}
}
renderProjects()

// Parallax for hero blobs
const blobEls = document.querySelectorAll('.blob')
if (blobEls.length) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10
    const y = (e.clientY / window.innerHeight - 0.5) * 10
    blobEls.forEach((el, i) => {
      const factor = (i + 1) * 0.5
      el.style.transform = `translate(${x * factor}px, ${y * factor}px)`
    })
  }, { passive: true })
}

// Spotlight follow effect
const spotlight = document.querySelector('.spotlight')
if (spotlight) {
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--spot-x', `${e.clientX}px`)
    document.documentElement.style.setProperty('--spot-y', `${e.clientY}px`)
  }, { passive: true })
}

// Rotating role text
const roles = ['Angular', 'React', 'TypeScript', 'UX-driven', 'Performance-focused']
const rotator = document.getElementById('role-rotator')
if (rotator) {
  let idx = 0
  setInterval(() => {
    idx = (idx + 1) % roles.length
    rotator.textContent = roles[idx]
    animate(rotator, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3, easing: 'ease-out' })
  }, 1600)
}
