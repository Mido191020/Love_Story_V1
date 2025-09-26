// LoveStory Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
    initializeCreatePage();
    initializeStoryPage();

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Nav active state
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Timeline interactions
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
});

// Home Page Initialization
function initializeHomePage() {
    // Typewriter effect for hero text
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Share Your Love Story Beautifully ✨',
                'Create Memories That Last Forever 💕',
                'Weave Your Love Into A Timeline 📖'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card-hover, section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Create Page Initialization
function initializeCreatePage() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const timelinePreview = document.getElementById('timelinePreview');
    const timelineCount = document.getElementById('timelineCount');

    let uploadedFiles = [];

    if (uploadZone && fileInput) {
        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop functionality
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const fileData = {
                            id: Date.now() + Math.random(),
                            name: file.name,
                            type: file.type,
                            url: e.target.result,
                            caption: '',
                            date: new Date().toISOString().split('T')[0]
                        };
                        uploadedFiles.push(fileData);
                        try {
                            const key = `memory_${fileData.id}`;
                            localStorage.setItem(key, JSON.stringify(fileData));
                        } catch (_) {}
                        updateTimelinePreview();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        function updateTimelinePreview() {
            if (uploadedFiles.length === 0) {
                timelinePreview.innerHTML = `
                    <div class="text-center py-12 text-gray-400">
                        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">💭</span>
                        </div>
                        <p>Start adding your memories to see your timeline</p>
                    </div>
                `;
            } else {
                timelinePreview.innerHTML = uploadedFiles.map(file => `
                    <div class="timeline-item bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100">
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0">
                                ${file.type.startsWith('image/') ? 
                                    `<img src="${file.url}" alt="${file.name}" class="w-16 h-16 object-cover rounded-lg">` :
                                    `<video src="${file.url}" class="w-16 h-16 object-cover rounded-lg"></video>`
                                }
                            </div>
                            <div class="flex-grow">
                                <input type="text" placeholder="Add a caption..." 
                                    class="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-200 outline-none"
                                    onchange="updateCaption('${file.id}', this.value)">
                                <div class="flex items-center justify-between mt-2">
                                    <span class="text-xs text-gray-500">${file.name}</span>
                                    <button onclick="removeFile('${file.id}')" class="text-red-400 hover:text-red-600 text-sm">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            timelineCount.textContent = `${uploadedFiles.length} memories added`;
        }

        // Global functions for timeline management
        window.updateCaption = function(fileId, caption) {
            const file = uploadedFiles.find(f => f.id == fileId);
            if (file) {
                file.caption = caption;
            }
        };

        window.removeFile = function(fileId) {
            uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
            try { localStorage.removeItem(`memory_${fileId}`); } catch (_) {}
            updateTimelinePreview();
        };
    }
}

// Story Page Initialization
function initializeStoryPage() {
    // Initialize related stories carousel
    if (document.getElementById('related-stories')) {
        new Splide('#related-stories', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 4000,
            breakpoints: {
                768: {
                    perPage: 1,
                },
                1024: {
                    perPage: 2,
                }
            }
        }).mount();
    }

    // Animate timeline items
    const timelineItems = document.querySelectorAll('.story-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        timelineObserver.observe(item);
    });
}

// Global Functions
function previewStory() {
    // Show example story modal or redirect
    window.location.href = 'story.html';
}

function viewStory() {
    window.location.href = 'story.html';
}

function publishStory() {
    // Simulate publishing
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = 'Publishing... ✨';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = 'Published Successfully! 🎉';
        button.classList.remove('from-pink-400', 'to-pink-600');
        button.classList.add('from-green-400', 'to-green-600');
        
        setTimeout(() => {
            window.location.href = 'story.html';
        }, 1500);
    }, 2000);
}

function saveDraft() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = 'Saving... 💾';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = 'Draft Saved! ✓';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }, 1000);
}

function toggleShare() {
    const shareUrl = 'lovestory.com/mido-malak';
    if (navigator.share) {
        navigator.share({
            title: 'Mido & Malak\'s Love Story',
            text: 'Check out this beautiful love story!',
            url: shareUrl
        });
    } else {
        // Fallback - show share popup
        showSharePopup();
    }
}

function showSharePopup() {
    // Create and show share popup
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Share This Love Story</h3>
            <div class="flex items-center space-x-3 mb-4">
                <input type="text" value="lovestory.com/mido-malak" readonly 
                    class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
                <button onclick="copyLink()" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                    Copy
                </button>
            </div>
            <div class="flex space-x-3 mb-6">
                <button class="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Facebook</button>
                <button class="flex-1 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">Twitter</button>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                class="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    document.body.appendChild(popup);
}

function copyLink() {
    const link = 'lovestory.com/mido-malak';
    navigator.clipboard.writeText(link).then(() => {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-500');
        button.classList.remove('bg-pink-500');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500');
            button.classList.add('bg-pink-500');
        }, 2000);
    });
}

function loveStory() {
    const button = event.target;
    const heartIcon = button.querySelector('svg');
    
    // Animate heart
    heartIcon.style.transform = 'scale(1.3)';
    heartIcon.style.color = '#EC4899';
    
    setTimeout(() => {
        heartIcon.style.transform = 'scale(1)';
    }, 200);
    
    // Show love message
    showNotification('💖 Thanks for loving their story!');
}

function sendWish() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = 'Sending... 💕';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = 'Sent Successfully! ✨';
        showNotification('Your beautiful wishes have been sent to the couple! 💕');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-white border border-pink-200 rounded-lg p-4 shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-2xl">💕</span>
            <p class="text-gray-700">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Add click handlers for buttons that don't have specific functions
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Read Story →')) {
        e.preventDefault();
        showNotification('This would open another beautiful love story! 💕');
    }
});

// Add hover effects for interactive elements
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('card-hover') || e.target.closest('.card-hover')) {
        const card = e.target.classList.contains('card-hover') ? e.target : e.target.closest('.card-hover');
        anime({
            targets: card,
            scale: 1.02,
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('card-hover') || e.target.closest('.card-hover')) {
        const card = e.target.classList.contains('card-hover') ? e.target : e.target.closest('.card-hover');
        anime({
            targets: card,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
});

// Add particle effect on button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('bg-gradient-to-r')) {
        createParticleEffect(e.target);
    }
});

function createParticleEffect(button) {
    const rect = button.getBoundingClientRect();
    const particles = [];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💕';
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.fontSize = '20px';
        
        document.body.appendChild(particle);
        
        anime({
            targets: particle,
            translateX: (Math.random() - 0.5) * 200,
            translateY: (Math.random() - 0.5) * 200,
            opacity: [1, 0],
            scale: [1, 0],
            duration: 1000,
            easing: 'easeOutQuad',
            complete: () => {
                particle.remove();
            }
        });
    }
}