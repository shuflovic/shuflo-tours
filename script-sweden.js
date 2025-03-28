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
            
hide1Button.addEventListener('click', styleDisplay1);
hide2Button.addEventListener('click', styleDisplay2);
          
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
document.addEventListener('DOMContentLoaded', () => {
    const menuToggleButton = document.querySelector('.menu-toggle');
    menuToggleButton.addEventListener('click', toggleMenu);
});


         document.addEventListener("scroll", () => {
        const buttons = document.querySelectorAll(".menu-btn");
        const sections = document.querySelectorAll("section");
        const navHeight = document.querySelector("nav").offsetHeight; // Fixed menu height
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top; // Top position relative to viewport
            const sectionHeight = section.offsetHeight;
            const sectionMid = sectionTop + sectionHeight / 2; // Midpoint of the section

            // Check if the section's midpoint is within the viewport, adjusted for nav height
            if (sectionMid > navHeight && sectionMid < window.innerHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        buttons.forEach((button) => {
            const link = button.querySelector("a");
            const target = link.getAttribute("href").substring(1); // Remove '#' from href
            
            if (target === currentSection) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
    });
