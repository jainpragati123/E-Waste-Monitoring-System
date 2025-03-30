// Game Configuration
const GAME_CONFIG = {
    initialTime: 60,
    baseXP: 10,
    streakBonus: 5,
    levelThresholds: [10, 25, 50, 100, 200],
    itemsPerLevel: {
        1: 4,
        2: 6,
        3: 8,
        4: 10,
        5: 12
    }
};

// Waste Items Database
const WASTE_ITEMS = {
    'e-waste': [
        { icon: '💻', label: 'Laptop', description: 'Electronic waste containing valuable metals and hazardous materials.' },
        { icon: '📱', label: 'Smartphone', description: 'Contains precious metals and toxic components.' },
        { icon: '📺', label: 'TV', description: 'Large electronic device with glass and hazardous materials.' },
        { icon: '🖨️', label: 'Printer', description: 'Contains electronic components and plastic parts.' }
    ],
    'battery': [
        { icon: '🔋', label: 'AA Battery', description: 'Contains harmful chemicals and metals.' },
        { icon: '🔋', label: 'Phone Battery', description: 'Lithium-ion battery requiring special disposal.' },
        { icon: '🔋', label: 'Car Battery', description: 'Lead-acid battery with toxic components.' }
    ],
    'plastic': [
        { icon: '🔄', label: 'Plastic Case', description: 'Recyclable plastic from electronic devices.' },
        { icon: '🔄', label: 'Cable', description: 'Plastic-coated wire with metal components.' },
        { icon: '🔄', label: 'Charger', description: 'Plastic electronic accessory.' }
    ],
    'metal': [
        { icon: '⚙️', label: 'Metal Frame', description: 'Recyclable metal from devices.' },
        { icon: '⚙️', label: 'Circuit Board', description: 'Contains valuable metals and components.' },
        { icon: '⚙️', label: 'Metal Casing', description: 'Recyclable metal housing.' }
    ]
};

class EwasteSortingGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.timeLeft = GAME_CONFIG.initialTime;
        this.isPlaying = false;
        this.timer = null;
        this.currentItems = [];
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.wasteContainer = document.getElementById('wasteItems');
        this.timeDisplay = document.getElementById('timeLeft');
        this.scoreDisplay = document.getElementById('currentScore');
        this.levelDisplay = document.getElementById('level');
        this.levelProgress = document.getElementById('levelProgress');
        this.currentStreakDisplay = document.getElementById('currentStreak');
        this.startButton = document.getElementById('startGame');
        this.pauseButton = document.getElementById('pauseGame');
        this.restartButton = document.getElementById('restartGame');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Drag and drop event listeners
        this.wasteContainer.addEventListener('dragstart', (e) => this.handleDragStart(e));
        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('dragover', (e) => this.handleDragOver(e));
            bin.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            bin.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    startGame() {
        this.resetGame();
        this.isPlaying = true;
        this.startButton.disabled = true;
        this.pauseButton.disabled = false;
        this.generateItems();
        this.startTimer();
    }

    resetGame() {
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.timeLeft = GAME_CONFIG.initialTime;
        this.currentItems = [];
        this.updateUI();
        this.wasteContainer.innerHTML = '';
    }

    generateItems() {
        const itemsPerLevel = GAME_CONFIG.itemsPerLevel[this.level];
        const allItems = Object.entries(WASTE_ITEMS).flatMap(([type, items]) => 
            items.map(item => ({ ...item, type }))
        );

        // Shuffle items
        for (let i = 0; i < itemsPerLevel; i++) {
            const randomIndex = Math.floor(Math.random() * allItems.length);
            this.currentItems.push(allItems[randomIndex]);
        }

        this.renderItems();
    }

    renderItems() {
        this.wasteContainer.innerHTML = this.currentItems.map((item, index) => `
            <div class="waste-item" draggable="true" data-index="${index}">
                <div class="waste-icon">${item.icon}</div>
                <div class="waste-label">${item.label}</div>
            </div>
        `).join('');
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.timeLeft > 0 && this.isPlaying) {
                this.timeLeft--;
                this.updateUI();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    togglePause() {
        this.isPlaying = !this.isPlaying;
        this.pauseButton.textContent = this.isPlaying ? 'Pause' : 'Resume';
    }

    handleDragStart(e) {
        if (!this.isPlaying) return;
        const item = e.target.closest('.waste-item');
        if (item) {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.dataset.index);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        const bin = e.target.closest('.bin');
        if (bin && !bin.classList.contains('drag-over')) {
            bin.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        const bin = e.target.closest('.bin');
        if (bin) {
            bin.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const bin = e.target.closest('.bin');
        const itemIndex = e.dataTransfer.getData('text/plain');
        
        if (bin && itemIndex !== '') {
            const item = this.currentItems[parseInt(itemIndex)];
            const isCorrect = item.type === bin.dataset.type;
            
            if (isCorrect) {
                this.handleCorrectSort(item);
            } else {
                this.handleIncorrectSort(item);
            }
        }

        // Reset drag states
        document.querySelectorAll('.bin').forEach(b => b.classList.remove('drag-over'));
        document.querySelectorAll('.waste-item').forEach(i => i.classList.remove('dragging'));
    }

    handleCorrectSort(item) {
        this.score += GAME_CONFIG.baseXP;
        this.streak++;
        this.currentItems = this.currentItems.filter((_, index) => index !== parseInt(itemIndex));
        
        // Check for level up
        this.checkLevelUp();
        
        // Update UI
        this.updateUI();
        this.renderItems();
        
        // Show success animation
        this.showSuccessAnimation();
    }

    handleIncorrectSort(item) {
        this.streak = 0;
        this.showEducationPopup(item);
        this.updateUI();
    }

    checkLevelUp() {
        const nextLevelThreshold = GAME_CONFIG.levelThresholds[this.level - 1];
        if (this.score >= nextLevelThreshold) {
            this.level++;
            this.showLevelUpAnimation();
        }
    }

    showSuccessAnimation() {
        const audio = new Audio('success.mp3');
        audio.play().catch(() => {}); // Ignore errors if audio fails to play
    }

    showEducationPopup(item) {
        const popup = document.createElement('div');
        popup.className = 'education-popup';
        popup.innerHTML = `
            <h3>Incorrect Sorting</h3>
            <p>${item.description}</p>
            <p>This item should be sorted as ${item.type}.</p>
            <button>Got it!</button>
        `;

        document.body.appendChild(popup);
        popup.querySelector('button').addEventListener('click', () => {
            popup.remove();
        });
    }

    showLevelUpAnimation() {
        const audio = new Audio('level-up.mp3');
        audio.play().catch(() => {}); // Ignore errors if audio fails to play
        
        const notification = document.createElement('div');
        notification.className = 'notification level-up';
        notification.textContent = `Level Up! You're now level ${this.level}!`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    updateUI() {
        this.timeDisplay.textContent = this.timeLeft;
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
        this.currentStreakDisplay.textContent = this.streak;
        
        // Update level progress
        const currentLevelThreshold = GAME_CONFIG.levelThresholds[this.level - 1] || 0;
        const nextLevelThreshold = GAME_CONFIG.levelThresholds[this.level - 1] || GAME_CONFIG.levelThresholds[GAME_CONFIG.levelThresholds.length - 1];
        const progress = ((this.score - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
        this.levelProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    endGame() {
        clearInterval(this.timer);
        this.isPlaying = false;
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        
        // Update user's total XP
        const userXP = parseInt(document.querySelector('.stat-value:nth-child(4)').textContent) || 0;
        document.querySelector('.stat-value:nth-child(4)').textContent = userXP + this.score;
        
        // Show game over popup
        const popup = document.createElement('div');
        popup.className = 'education-popup';
        popup.innerHTML = `
            <h3>Game Over!</h3>
            <p>Final Score: ${this.score} XP</p>
            <p>Level Reached: ${this.level}</p>
            <p>Best Streak: ${this.streak}</p>
            <button>Play Again</button>
        `;

        document.body.appendChild(popup);
        popup.querySelector('button').addEventListener('click', () => {
            popup.remove();
            this.startGame();
        });
    }

    restartGame() {
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Reset game state
        this.resetGame();
        
        // Reset UI elements
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.pauseButton.textContent = 'Pause';
        
        // Remove any existing popups
        const popups = document.querySelectorAll('.education-popup');
        popups.forEach(popup => popup.remove());
        
        // Clear waste items container
        this.wasteContainer.innerHTML = '';

        // Reset bin states by removing drag-over class
        document.querySelectorAll('.bin').forEach(bin => {
            bin.classList.remove('drag-over');
        });
        
        // Show notification
        this.showNotification('Game restarted! Click Start Game to begin.');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new EwasteSortingGame();
}); 