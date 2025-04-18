import { checkpointMessage } from './message.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.whatsappButton');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const titleText = button.getAttribute('title');
            checkpointMessage(titleText);
        });
    });
});

function saveChecklist() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checklist = {};

    checkboxes.forEach(checkbox => {
        checklist[checkbox.id] = checkbox.checked;
    });

    localStorage.setItem('checklist', JSON.stringify(checklist));
}

function loadChecklist() {
    const checklist = JSON.parse(localStorage.getItem('checklist')) || {};
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = checklist[checkbox.id] || false;
    });
}

function updateSummary() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    document.getElementById('summary').textContent = `${completed}/${total}`;
}

function setupListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveChecklist();
            updateSummary();
        });
    });
}

loadChecklist();
updateSummary();
setupListeners();

const hide1 = document.getElementById('hide1');
const hide2 = document.getElementById('hide2');

hide1.style.display = 'none';
hide2.style.display = 'none';

const styleDisplay1 = () => {
  if (hide1.style.display === 'none') {
    hide1.style.display = 'block';
    hide2.style.display = 'none';
  } else {
    hide1.style.display = 'none';
  }
};

const styleDisplay2 = () => {
  if (hide2.style.display === 'none') {
    hide2.style.display = 'block';
    hide1.style.display = 'none';
  } else {
    hide2.style.display = 'none';
  }
};

document.getElementById('hide1Button').addEventListener('click', styleDisplay1);
document.getElementById('hide2Button').addEventListener('click', styleDisplay2);

document.addEventListener("scroll", () => {
    const buttons = document.querySelectorAll(".menu-btn");
    const sections = document.querySelectorAll("section");
    const navHeight = document.querySelector("nav").offsetHeight;
    let currentSection = "";

    // Find the current section based on scroll position
    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        // Check if section is at least partially in view
        if (sectionTop <= navHeight + 50 && sectionBottom > navHeight) {
            currentSection = section.getAttribute("id");
        }
    });

    // Update active button states
    buttons.forEach((button) => {
        const link = button.querySelector("a");
        const target = link.getAttribute("href").substring(1);

        button.classList.toggle("active", target === currentSection);
    });
});

// Smooth scrolling for button clicks
document.querySelectorAll(".menu-btn a").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        const navHeight = document.querySelector("nav").offsetHeight;

        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: "smooth"
        });

        // Remove active class from all buttons
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        this.parentElement.classList.add('active');
    });
});

// Handle click event to add and remove active class
const kmenuButtons = document.querySelectorAll('.menu-btn');
kmenuButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        kmenuButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        button.classList.add('active');
    });
});
