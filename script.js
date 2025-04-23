
const currentDateEl = document.getElementById('current-date');
const habitsContainer = document.getElementById('habits-container');
const quickAddBtn = document.getElementById('quick-add');
const habitPanel = document.getElementById('habit-panel');
const habitForm = document.getElementById('habit-form');
const toastContainer = document.getElementById('toast-container');
const mascotSpeech = document.getElementById('mascot-speech');

// State
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let currentStreak = 0;

// Initialize
function init() {
    updateDate();
    renderHabits();
    setupEventListeners();
    createParticles();
    showMascotMessage('Welcome to Habit-Hero! Let\'s build some amazing habits together! 🚀');
}

// Update current date
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Create floating particles
function createParticles() {
    const particles = document.getElementById('particles');
    const icons = ['📚', '💪', '🧘', '⭐'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = icons[Math.floor(Math.random() * icons.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particles.appendChild(particle);
    }
}

// Render habits
function renderHabits() {
    habitsContainer.innerHTML = '';
    habits.forEach((habit, index) => {
        const card = createHabitCard(habit, index);
        habitsContainer.appendChild(card);
    });
    updateStreakSummary();
}

// Create habit card
function createHabitCard(habit, index) {
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.style.borderLeft = `4px solid ${habit.color}`;
    
    card.innerHTML = `
        <div class="habit-header">
            <h3>${habit.title}</h3>
            <span class="frequency-badge">${habit.frequency}× per week</span>
        </div>
        <div class="streak-meter">
            <div class="progress-bar" style="width: ${(habit.currentStreak / habit.frequency) * 100}%"></div>
        </div>
        <div class="habit-actions">
            <button class="check-in-btn" onclick="checkIn(${index})">
                <i class="fas fa-check"></i>
            </button>
            <button class="edit-btn" onclick="editHabit(${index})">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="delete-btn" onclick="deleteHabit(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Event Listeners
function setupEventListeners() {
    quickAddBtn.addEventListener('click', () => {
        habitPanel.classList.add('active');
    });

    // Add close button functionality
    const closePanelBtn = document.getElementById('close-panel');
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => {
            habitPanel.classList.remove('active');
        });
    }

    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('habit-title').value.trim();
        const frequency = parseInt(document.getElementById('habit-frequency').value);
        const color = document.getElementById('habit-color').value;

        // Validate form
        if (!title) {
            showToast('Please enter a habit title before saving');
            return;
        }

        const newHabit = {
            title,
            frequency,
            color,
            currentStreak: 0,
            lastChecked: null
        };

        habits.push(newHabit);
        saveHabits();
        renderHabits();
        habitPanel.classList.remove('active');
        showToast('Habit added successfully! 🎉');
        
        // Reset form
        habitForm.reset();
    });

    // Frequency stepper buttons
    document.getElementById('decrease-freq').addEventListener('click', () => {
        const input = document.getElementById('habit-frequency');
        if (input.value > 1) input.value = parseInt(input.value) - 1;
    });

    document.getElementById('increase-freq').addEventListener('click', () => {
        const input = document.getElementById('habit-frequency');
        if (input.value < 7) input.value = parseInt(input.value) + 1;
    });
}

// Habit Actions
function checkIn(index) {
    const habit = habits[index];
    const today = new Date().toDateString();
    
    if (habit.lastChecked === today) {
        showToast('Already checked in today! 🌟');
        return;
    }

    habit.currentStreak++;
    habit.lastChecked = today;
    saveHabits();
    renderHabits();
    showToast('Great job! Keep it up! 💪');
    showMascotMessage(getRandomMotivationalMessage());
}

function editHabit(index) {
    const habit = habits[index];
    document.getElementById('habit-title').value = habit.title;
    document.getElementById('habit-frequency').value = habit.frequency;
    document.getElementById('habit-color').value = habit.color;
    habitPanel.classList.add('active');
    // TODO: Update form submission to handle editing
}

function deleteHabit(index) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits.splice(index, 1);
        saveHabits();
        renderHabits();
        showToast('Habit deleted successfully');
    }
}

// Utility Functions
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showMascotMessage(message) {
    mascotSpeech.textContent = message;
    mascotSpeech.classList.add('visible');
    
    setTimeout(() => {
        mascotSpeech.classList.remove('visible');
    }, 3000);
}

function getRandomMotivationalMessage() {
    const messages = [
        'You\'re doing amazing! 🌟',
        'Keep up the great work! 💪',
        'Every day counts! 🎯',
        'You\'re building a better you! 🚀',
        'Small steps, big changes! 🌈'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function updateStreakSummary() {
    const totalHabits = habits.length;
    const completedToday = habits.filter(habit => 
        habit.lastChecked === new Date().toDateString()
    ).length;
    
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completedToday} / ${totalHabits}`;
    }
}

// Initialize the app
init(); 