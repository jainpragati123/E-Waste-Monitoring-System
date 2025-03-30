// Import AI Scanner Service
import aiScannerService from './ai-scanner-service.js';

// Global function for impact calculation
function calculateImpact() {
    const deviceType = document.getElementById('deviceType').value;
    const deviceCount = parseInt(document.getElementById('deviceCount').value);
    
    if (!deviceType || deviceCount < 1) {
        alert('Please select a device type and enter a valid quantity');
        return;
    }

    // Environmental impact data (example values)
    const impactData = {
        laptop: {
            co2: 160, // kg CO2 saved
            water: 1900, // liters of water saved
            materials: ['Gold', 'Silver', 'Copper', 'Plastic']
        },
        smartphone: {
            co2: 45,
            water: 500,
            materials: ['Gold', 'Silver', 'Rare Earth Metals']
        },
        tablet: {
            co2: 80,
            water: 1000,
            materials: ['Gold', 'Silver', 'Glass']
        },
        tv: {
            co2: 200,
            water: 2500,
            materials: ['Glass', 'Plastic', 'Metal']
        }
    };

    const impact = impactData[deviceType];
    const totalCO2 = impact.co2 * deviceCount;
    const totalWater = impact.water * deviceCount;

    // Display results
    document.getElementById('impactResults').innerHTML = `
        <div class="impact-stat">
            <h4>CO2 Saved</h4>
            <p>${totalCO2} kg</p>
        </div>
        <div class="impact-stat">
            <h4>Water Saved</h4>
            <p>${totalWater} liters</p>
        </div>
    `;

    document.getElementById('resourceResults').innerHTML = `
        <div class="resource-list">
            <h4>Recoverable Materials</h4>
            <ul>
                ${impact.materials.map(material => `<li>${material}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Navigation and Section Management
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Update navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
    }
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', function() {
    // Add back buttons to all sections except home
    document.querySelectorAll('.section:not(#home)').forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = '←';
            backButton.addEventListener('click', () => showSection('home'));
            
            // Insert back button before the heading text
            heading.insertBefore(backButton, heading.firstChild);
        }
    });

    // Navigation handling
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Home screen button handling
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            showSection('collection');
        });
    }

    // Feature buttons handling
    document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(targetSection);
        });
    });

    // Show home section by default
    showSection('home');

    // FAQ Toggle
    function toggleFAQ(element) {
        const faqItem = element.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                otherAnswer.style.display = 'none';
            }
        });
        
        // Toggle current FAQ item
        faqItem.classList.toggle('active');
        answer.style.display = faqItem.classList.contains('active') ? 'block' : 'none';
    }

    // Initialize FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        const answer = item.querySelector('.faq-answer');
        answer.style.display = 'none';
    });

    // Form Handling
    document.getElementById('collectionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            wasteType: document.getElementById('wasteType').value,
            quantity: document.getElementById('quantity').value,
            date: document.getElementById('date').value,
            notes: document.getElementById('notes').value
        };
        
        // Here you would typically send the data to a server
        console.log('Collection Request:', formData);
        alert('Collection request submitted successfully!');
        this.reset();
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };
        
        // Here you would typically handle authentication
        console.log('Login Attempt:', formData);
        alert('Login successful!');
        this.reset();
    });

    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: password
        };
        
        // Here you would typically handle registration
        console.log('Registration:', formData);
        alert('Registration successful!');
        this.reset();
    });

    // Set minimum date for collection request to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;

    // Add event listener for Calculate Impact button
    document.getElementById('calculateImpactBtn').addEventListener('click', calculateImpact);

    // Smart Bin Monitoring
    function updateBinStatus() {
        // Simulate real-time bin status updates
        const bins = document.querySelectorAll('.bin-card');
        bins.forEach(bin => {
            const capacity = parseInt(bin.querySelector('.bin-details p:nth-child(2)').textContent.match(/\d+/)[0]);
            const status = bin.querySelector('.bin-status');
            
            // Update status class based on capacity
            status.className = 'bin-status ' + 
                (capacity > 80 ? 'full' : capacity > 50 ? 'moderate' : 'low');
            
            // Update last emptied time
            const lastEmptied = bin.querySelector('.bin-details p:nth-child(3)');
            const hours = parseInt(lastEmptied.textContent.match(/\d+/)[0]);
            if (hours < 24) {
                lastEmptied.textContent = `Last Emptied: ${hours + 1} hours ago`;
            }
        });
    }

    // Rewards System
    let userPoints = 0;
    const pointsPerDevice = {
        laptop: 100,
        smartphone: 50,
        tablet: 75,
        tv: 150
    };

    function updateUserPoints(deviceType) {
        userPoints += pointsPerDevice[deviceType];
        document.querySelector('.points-display').textContent = userPoints;
        
        // Update level
        const level = calculateLevel(userPoints);
        document.querySelector('.level-display').textContent = level;
        
        // Update progress bar
        const nextLevelPoints = getNextLevelPoints(level);
        const progress = (userPoints % nextLevelPoints) / nextLevelPoints * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
    }

    function calculateLevel(points) {
        if (points < 500) return 'Bronze';
        if (points < 1000) return 'Silver';
        if (points < 2000) return 'Gold';
        return 'Platinum';
    }

    function getNextLevelPoints(level) {
        switch(level) {
            case 'Bronze': return 500;
            case 'Silver': return 1000;
            case 'Gold': return 2000;
            default: return 5000;
        }
    }

    // Map Integration (Example)
    function initializeMap() {
        // This would typically integrate with a mapping service like Google Maps
        const mapDisplay = document.getElementById('map-display');
        mapDisplay.innerHTML = `
            <div class="map-placeholder">
                <p>Map integration would be displayed here</p>
            </div>
        `;
    }

    // Gamification System
    let userData = {
        xp: 2450,
        level: 5,
        streak: 7,
        greenCoins: 850,
        achievements: {
            'eco-pioneer': { progress: 8, total: 10, unlocked: false },
            'recycling-king': { progress: 5, total: 10, unlocked: false },
            'streak-master': { progress: 7, total: 30, unlocked: false }
        },
        dailyChallenges: {
            'recycle-phones': { progress: 2, total: 3, completed: false },
            'recycle-laptops': { progress: 1, total: 2, completed: false },
            'social-share': { progress: 0, total: 1, completed: false }
        }
    };

    // Update user profile
    function updateUserProfile() {
        document.querySelector('.username').textContent = 'Eco-Warrior';
        document.querySelector('.level-text').textContent = `Level ${userData.level}`;
        document.querySelector('.stat-value:nth-child(2)').textContent = userData.streak;
        document.querySelector('.stat-value:nth-child(4)').textContent = userData.xp;
        document.querySelector('.stat-value:nth-child(6)').textContent = userData.greenCoins;
    }

    // Handle daily challenges
    function updateDailyChallenges() {
        Object.entries(userData.dailyChallenges).forEach(([challengeId, data]) => {
            const card = document.querySelector(`.challenge-card[data-challenge="${challengeId}"]`);
            if (card) {
                const progress = (data.progress / data.total) * 100;
                card.querySelector('.progress').style.width = `${progress}%`;
                card.querySelector('.challenge-progress span').textContent = `${data.progress}/${data.total}`;
                
                if (data.completed) {
                    card.classList.add('completed');
                }
            }
        });
    }

    // Handle achievements
    function updateAchievements() {
        Object.entries(userData.achievements).forEach(([achievementId, data]) => {
            const card = document.querySelector(`.achievement-card[data-achievement="${achievementId}"]`);
            if (card) {
                const progress = (data.progress / data.total) * 100;
                card.querySelector('.progress').style.width = `${progress}%`;
                card.querySelector('.achievement-progress span').textContent = 
                    achievementId === 'recycling-king' ? 
                    `Level ${data.progress}/${data.total}` : 
                    `${data.progress}/${data.total}`;
                
                if (data.unlocked) {
                    card.classList.add('unlocked');
                    card.classList.remove('locked');
                }
            }
        });
    }

    // Handle level up
    function checkLevelUp() {
        const xpNeeded = userData.level * 500;
        if (userData.xp >= xpNeeded) {
            userData.level++;
            userData.xp -= xpNeeded;
            showLevelUpAnimation();
            checkAchievements();
        }
    }

    // Show level up animation
    function showLevelUpAnimation() {
        const levelBadge = document.querySelector('.level-badge');
        levelBadge.classList.add('level-up');
        setTimeout(() => levelBadge.classList.remove('level-up'), 500);
        
        // Show notification
        showNotification(`Level Up! You're now level ${userData.level}!`);
    }

    // Handle achievements
    function checkAchievements() {
        Object.entries(userData.achievements).forEach(([achievementId, data]) => {
            if (!data.unlocked && data.progress >= data.total) {
                data.unlocked = true;
                showAchievementUnlock(achievementId);
            }
        });
    }

    // Show achievement unlock animation
    function showAchievementUnlock(achievementId) {
        const card = document.querySelector(`.achievement-card[data-achievement="${achievementId}"]`);
        if (card) {
            card.classList.add('achievement-unlock');
            setTimeout(() => card.classList.remove('achievement-unlock'), 500);
            showNotification(`Achievement Unlocked: ${card.querySelector('h4').textContent}!`);
        }
    }

    // Show notification
    function showNotification(message) {
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

    // Handle shop item redemption
    function handleShopItemRedemption(itemId) {
        const shopItems = {
            'plant-tree': { cost: 500, name: 'Plant a Tree' },
            'eco-voucher': { cost: 1000, name: 'Eco Shopping Voucher' },
            'recycling-kit': { cost: 2000, name: 'Recycling Kit' }
        };

        const item = shopItems[itemId];
        if (item && userData.greenCoins >= item.cost) {
            userData.greenCoins -= item.cost;
            updateUserProfile();
            showNotification(`Successfully redeemed ${item.name}!`);
        } else {
            showNotification('Not enough Green Coins!');
        }
    }

    // AI Waste Scanner Functionality
    const startCameraBtn = document.getElementById('startCamera');
    const captureImageBtn = document.getElementById('captureImage');
    const uploadImageBtn = document.getElementById('uploadImage');
    const imageInput = document.getElementById('imageInput');
    const cameraPreview = document.getElementById('cameraPreview');
    const cameraFeed = document.getElementById('cameraFeed');
    const scanResults = document.getElementById('scanResults');
    const recyclingGuide = document.getElementById('recyclingGuide');
    const environmentalImpact = document.getElementById('environmentalImpact');

    let stream = null;
    let isCameraActive = false;

    // Start camera
    startCameraBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            cameraFeed.srcObject = stream;
            cameraFeed.style.display = 'block';
            cameraPreview.style.display = 'none';
            startCameraBtn.disabled = true;
            captureImageBtn.disabled = false;
            isCameraActive = true;
        } catch (err) {
            console.error('Error accessing camera:', err);
            showNotification('Error accessing camera. Please check permissions.');
            resetCameraState();
        }
    });

    // Capture image
    captureImageBtn.addEventListener('click', () => {
        if (!isCameraActive || !stream) {
            showNotification('Camera is not active. Please start the camera first.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        canvas.getContext('2d').drawImage(cameraFeed, 0, 0);
        processImage(canvas.toDataURL('image/jpeg'));
    });

    // Upload image
    uploadImageBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const imageData = await aiScannerService.imageToBase64(e.target.files[0]);
                processImage(imageData);
            } catch (error) {
                console.error('Error processing uploaded image:', error);
                showNotification('Error processing uploaded image. Please try again.');
            }
        }
    });

    // Process image with AI
    async function processImage(imageData) {
        // Show scanning animation
        scanResults.innerHTML = `
            <div class="scanning">
                <div class="camera-icon">🔍</div>
                <p>Analyzing waste item...</p>
            </div>
        `;

        try {
            // Analyze image using AI service
            const result = await aiScannerService.analyzeImage(imageData);
            displayResults(result);
        } catch (error) {
            console.error('Error processing image:', error);
            showNotification('Error analyzing image. Please try again.');
            resetScannerUI();
        }
    }

    // Display scan results
    function displayResults(data) {
        // Display waste type
        scanResults.innerHTML = `
            <div class="waste-type result-fade-in">
                <div class="waste-icon">${getWasteIcon(data.detectedType)}</div>
                <div class="waste-details">
                    <div class="waste-name">${data.detectedType.charAt(0).toUpperCase() + data.detectedType.slice(1)}</div>
                    <div class="waste-description">Confidence: ${(data.confidence * 100).toFixed(1)}%</div>
                    <div class="waste-category">Category: ${data.category}</div>
                </div>
            </div>
        `;

        // Display recycling guide
        recyclingGuide.innerHTML = `
            <ul class="recycling-steps result-fade-in">
                ${data.recyclingSteps.map((step, index) => `
                    <li>
                        <div class="step-number">${index + 1}</div>
                        <div class="step-text">${step}</div>
                    </li>
                `).join('')}
            </ul>
        `;

        // Display environmental impact
        environmentalImpact.innerHTML = `
            <div class="impact-stats result-fade-in">
                <div class="impact-stat">
                    <div class="impact-value">${data.environmentalImpact.co2Saved} kg</div>
                    <div class="impact-label">CO2 Saved</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-value">${data.environmentalImpact.waterSaved} L</div>
                    <div class="impact-label">Water Saved</div>
                </div>
                <div class="impact-stat">
                    <div class="impact-value">${data.environmentalImpact.materialsRecovered.length}</div>
                    <div class="impact-label">Materials Recovered</div>
                </div>
            </div>
        `;

        // Award XP based on waste type
        const xpEarned = calculateXPForWasteType(data.detectedType);
        userData.xp += xpEarned;
        updateUserProfile();
        showNotification(`+${xpEarned} XP earned for scanning!`);
    }

    // Helper function to get waste icon
    function getWasteIcon(wasteType) {
        const icons = {
            'laptop': '💻',
            'smartphone': '📱',
            'tablet': '📱',
            'television': '📺',
            'battery': '🔋',
            'unknown': '❓'
        };
        return icons[wasteType] || icons.unknown;
    }

    // Helper function to calculate XP based on waste type
    function calculateXPForWasteType(wasteType) {
        const xpValues = {
            'laptop': 100,
            'smartphone': 50,
            'tablet': 75,
            'television': 150,
            'battery': 30,
            'unknown': 10
        };
        return xpValues[wasteType] || xpValues.unknown;
    }

    // Helper function to reset scanner UI
    function resetScannerUI() {
        scanResults.innerHTML = `
            <div class="scan-placeholder">
                <p>Scan results will appear here</p>
            </div>
        `;
        recyclingGuide.innerHTML = `
            <div class="guide-placeholder">
                <p>Recycling instructions will appear here</p>
            </div>
        `;
        environmentalImpact.innerHTML = `
            <div class="impact-placeholder">
                <p>Environmental impact details will appear here</p>
            </div>
        `;
    }

    // Helper function to reset camera state
    function resetCameraState() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        isCameraActive = false;
        startCameraBtn.disabled = false;
        captureImageBtn.disabled = true;
        cameraFeed.style.display = 'none';
        cameraPreview.style.display = 'flex';
    }

    // Clean up camera stream when leaving scanner section
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            resetCameraState();
        });
    });

    // Initialize button states
    captureImageBtn.disabled = true;

    // Initialize gamification system
    updateUserProfile();
    updateDailyChallenges();
    updateAchievements();
    
    // Add event listeners for shop buttons
    document.querySelectorAll('.shop-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = btn.closest('.shop-item').dataset.item;
            handleShopItemRedemption(itemId);
        });
    });
}); 