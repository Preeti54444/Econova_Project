// ========================================
// WETLANDGUARD - JAVASCRIPT FUNCTIONALITY
// ========================================

// API Configuration (Global)
window.API_BASE_URL = window.location.origin === 'http://127.0.0.1:5500' || window.location.origin === 'http://localhost:5500'
    ? 'http://localhost:3004/api'
    : '/api';
const API_BASE_URL = window.API_BASE_URL;

// Offline mode flag
let isOfflineMode = false;

// Global State Management
const appState = {
    reports: [],
    selectedReport: null,
    currentReportID: 0,
    map: null,
    markers: [],
    userLocation: null,
    userMarker: null,
    locationWatchId: null,
    locationPermissionGranted: false,
};

const mockReports = [
    {
        id: 1001,
        type: 'dumping',
        description: 'Large quantities of construction waste found near the wetland edge. This appears to be ongoing dumping.',
        location: 'Thane Creek, Navi Mumbai',
        latitude: 19.0330,
        longitude: 73.0297,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'action',
        reporter: 'John Smith',
        image: null,
        progress: 75
    },
    {
        id: 1002,
        type: 'sewage',
        description: 'Foul odor and discoloration detected in water. Possible sewage discharge from nearby facility.',
        location: 'Mithi River, Mumbai',
        latitude: 19.0896,
        longitude: 72.8656,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'review',
        reporter: 'Maria Garcia',
        image: null,
        progress: 40
    },
    {
        id: 1003,
        type: 'construction',
        description: 'Unauthorized machinery and foundation work observed. No permits visible.',
        location: 'Manori Creek, Mumbai',
        latitude: 19.1547,
        longitude: 72.7922,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'resolved',
        reporter: 'David Johnson',
        image: null,
        progress: 100
    },
    {
        id: 1004,
        type: 'dumping',
        description: 'Scattered plastic and metal debris throughout the wetland. Environmental hazard.',
        location: 'Versova Creek, Mumbai',
        latitude: 19.1298,
        longitude: 72.8098,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'reported',
        reporter: 'Alice Wong',
        image: null,
        progress: 10
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('WetlandGuard App Initialized');

    await loadReportsFromAPI();
    appState.currentReportID = appState.reports.length > 0
        ? Math.max(...appState.reports.map(r => r.id)) + 1
        : 1001;

    setupEventListeners();

    initializeMap();
    renderCitizenDashboard();
    renderAuthorityDashboard();
    updateDashboardStats();

    setTimeout(() => {
        checkLocationPermission();
    }, 2000);
});

async function loadReportsFromAPI() {
    console.log('[INFO] Using offline mode with mock data');
    appState.reports = mockReports;
}

function setupEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFormSubmit(e);
            return false;
        }, false);
    }

    const description = document.getElementById('description');
    description.addEventListener('input', updateCharCount);

    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.querySelector('.image-upload-area');

    imageUpload.addEventListener('change', handleImageUpload);

    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => imageUpload.click());

    // Geolocation
    document.getElementById('geolocateBtn').addEventListener('click', getGeolocation);

    // My Location button on map
    const myLocationBtn = document.getElementById('myLocationBtn');
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', centerMapOnUserLocation);
    }

    // Dashboard filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterReports(e.target.dataset.filter);
        });
    });

    // Camera Handlers
    const startCameraBtn = document.getElementById('startCameraBtn');
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startCamera);
    }
    const capturePhotoBtn = document.getElementById('capturePhotoBtn');
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', takePhoto);
    }
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopCamera);
    }

    // Authority dashboard filters
    document.getElementById('statusFilter').addEventListener('change', applyAuthorityFilters);
    document.getElementById('typeFilter').addEventListener('change', applyAuthorityFilters);

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// ========== REPORT FORM HANDLING ==========
function handleFormSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    console.log('[FORM] Submit triggered');

    const formData = new FormData(document.getElementById('reportForm'));
    const issueType = formData.get('issueType');
    const description = formData.get('description');
    const location = formData.get('location');
    const name = formData.get('name') || 'Anonymous';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';

    console.log('[FORM] Data:', { issueType, description, location, name });

    if (!issueType || !description || !location) {
        showError('Please fill in all required fields');
        return false;
    }

    const newReport = {
        id: appState.currentReportID++,
        type: issueType,
        description: description,
        location: location,
        latitude: appState.userLocation?.latitude || (19.0 + Math.random() * 0.2),
        longitude: appState.userLocation?.longitude || (72.8 + Math.random() * 0.3),
        date: new Date(),
        status: 'reported',
        reporter: name,
        email: email,
        phone: phone,
        progress: 10
    };

    appState.reports.push(newReport);

    if (appState.map) {
        addMapMarker(newReport);
    }

    showSuccessMessage();
    
    setTimeout(() => {
        resetForm();
        renderCitizenDashboard();
        renderAuthorityDashboard();
        updateDashboardStats();
        
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    }, 3000);
}

function updateCharCount() {
    const desc = document.getElementById('description');
    const count = desc.value.length;
    const charCountEl = document.getElementById('charCount');
    if (charCountEl) {
        charCountEl.textContent = count;
    } else {
        document.querySelector('.char-count').textContent = `${count} / 500`;
    }

    if (count > 500) {
        desc.value = desc.value.substring(0, 500);
    }

    // Color change based on usage
    if (count > 400) {
        desc.style.borderColor = 'var(--yellow-accent)';
    } else if (count > 250) {
        desc.style.borderColor = 'var(--light-green)';
    } else {
        desc.style.borderColor = 'var(--light-border)';
    }
}

function resetFormUI() {
    document.querySelectorAll('.issue-btn').forEach(btn => {
        btn.style.borderColor = '';
        btn.style.backgroundColor = '';
    });
}

function resetForm() {
    // Reset form inputs
    const form = document.getElementById('reportForm');
    if (form) {
        form.reset();
    }

    // Clear character counter
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0';
    }

    // Clear image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
    }

    // Clear coordinates display
    const coordsDisplay = document.getElementById('coordsDisplay');
    if (coordsDisplay) {
        coordsDisplay.innerHTML = '';
        coordsDisplay.classList.remove('show');
    }

    // Hide success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'none';
        successMessage.classList.remove('show');
    }

    // Reset form UI
    resetFormUI();

    // Reset progress step to 1
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });

    // Reset issue type buttons
    document.querySelectorAll('input[name="issueType"]').forEach(input => {
        input.checked = false;
    });
}

// ========== IMAGE UPLOAD ==========
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    processImages(files);
}

function handleDragOver(e) {
    e.preventDefault();
    document.querySelector('.image-upload-area').classList.add('dragover');
}

function handleDragLeave(e) {
    document.querySelector('.image-upload-area').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    document.querySelector('.image-upload-area').classList.remove('dragover');

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    processImages(imageFiles);
}

function processImages(files) {
    const preview = document.getElementById('imagePreview');

    files.forEach(file => {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('File size exceeds 5MB limit');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.style.cursor = 'pointer';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="preview-remove" type="button">×</button>
            `;

            div.querySelector('.preview-remove').addEventListener('click', (ev) => {
                ev.stopPropagation();
                div.remove();
            });

            div.addEventListener('click', (ev) => {
                if (!ev.target.classList.contains('preview-remove')) {
                    openImageViewer(e.target.result, 'Uploaded Image');
                }
            });

            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// ========== LIVE CAMERA MANAGEMENT ==========
let cameraStream = null;

async function startCamera() {
    const container = document.getElementById('cameraContainer');
    const video = document.getElementById('cameraVideo');
    const startBtn = document.getElementById('startCameraBtn');

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        video.srcObject = cameraStream;
        container.style.display = 'block';
        startBtn.style.display = 'none';

        // Auto-detect location when camera starts to ensure it's ready
        if (!appState.userLocation) {
            getGeolocation();
        }
    } catch (err) {
        console.error('Error accessing camera:', err);
        showError('Could not access camera. Please ensure you have given permission.');
    }
}

function stopCamera() {
    const container = document.getElementById('cameraContainer');
    const startBtn = document.getElementById('startCameraBtn');

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }

    container.style.display = 'none';
    startBtn.style.display = 'inline-flex';
}

function takePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const photoPreview = document.getElementById('imagePreview');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get automatically captured GEO tag during photo capture with high accuracy
    let geoInfo = "Detecting high-precision location...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            appState.userLocation = { latitude, longitude, accuracy };
            console.log(`[GEO] High precision capture: ${latitude}, ${longitude} (±${accuracy}m)`);

            // Update the badge text if the element is already created
            const badge = div.querySelector('.photo-geo-badge');
            if (badge) {
                badge.innerHTML = `<i class="fas fa-location-dot"></i> Accurate to ${Math.round(accuracy)}m`;
            }

            // Automatically fill the location input with high-accuracy coordinates
            const locationInput = document.getElementById('location');
            if (locationInput) {
                locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                // Show coordinates display if it exists
                const coordsDisplay = document.getElementById('coordsDisplay');
                if (coordsDisplay) {
                    coordsDisplay.innerHTML = `📍 Captured Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`;
                    coordsDisplay.classList.add('show');
                }

                // Detailed Reverse Geocoding (Full Address)
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.address) {
                            const addr = data.address;
                            const fullDetail = [
                                addr.house_number || addr.building,
                                addr.road,
                                addr.suburb || addr.neighbourhood,
                                addr.city || addr.town || addr.village,
                                addr.postcode
                            ].filter(Boolean).join(', ');

                            const finalAddress = fullDetail || data.display_name;
                            locationInput.value = finalAddress;

                            if (coordsDisplay) {
                                coordsDisplay.innerHTML = `📍 Full Address: ${finalAddress}<br><small>${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)</small>`;
                            }
                        }
                    })
                    .catch(e => console.error('Address lookup failed:', e));
            }
        }, (err) => {
            console.warn('[GEO] High precision capture failed, using last known', err);
        }, { enableHighAccuracy: true, timeout: 5000 });
    }

    // Convert canvas to image
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Create preview item
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.style.cursor = 'pointer';

    // Initial badge
    const initialAccuracy = appState.userLocation?.accuracy ? `Accurate to ${Math.round(appState.userLocation.accuracy)}m` : 'Geo-Tagged';

    div.innerHTML = `
        <img src="${dataUrl}" alt="Captured Photo" onclick="openImageViewer('${dataUrl}', '${appState.userLocation ? appState.userLocation.latitude.toFixed(6) + ', ' + appState.userLocation.longitude.toFixed(6) : ''}')">
        <div class="photo-geo-badge" style="position: absolute; bottom: 5px; left: 5px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
            <i class="fas fa-location-dot"></i> ${initialAccuracy}
        </div>
        <button class="preview-remove" type="button" style="z-index: 10;">×</button>
    `;

    div.querySelector('.preview-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        div.remove();
    });

    // Make the whole div clickable for viewing, but exclude the remove button
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('preview-remove')) {
            const latLong = appState.userLocation ? `${appState.userLocation.latitude.toFixed(6)}, ${appState.userLocation.longitude.toFixed(6)}` : '';
            openImageViewer(dataUrl, latLong);

            // Auto-fill coordinates into the location field when image is clicked
            if (appState.userLocation) {
                const locationInput = document.getElementById('location');
                if (locationInput) {
                    locationInput.value = `${appState.userLocation.latitude.toFixed(6)}, ${appState.userLocation.longitude.toFixed(6)}`;

                    const coordsDisplay = document.getElementById('coordsDisplay');
                    if (coordsDisplay) {
                        coordsDisplay.innerHTML = `📍 Linked Location: ${appState.userLocation.latitude.toFixed(6)}, ${appState.userLocation.longitude.toFixed(6)}`;
                        coordsDisplay.classList.add('show');
                    }
                }
                showNotification('Location synced from selected image! 📍');
            }
        }
    });

    photoPreview.appendChild(div);

    // Optional: Add a visual feedback
    showNotification('Live image captured with high-accuracy GEO tag! 📸');
}

// ========== IMAGE VIEWER ==========
function openImageViewer(src, geo) {
    const modal = document.getElementById('imageViewerModal');
    const fullImg = document.getElementById('fullViewImage');
    const meta = document.getElementById('imageViewerMeta');

    fullImg.src = src;
    meta.innerHTML = geo ? `<strong>📍 Captured Location:</strong><br>${geo}` : '<em>No GPS data available</em>';

    modal.classList.add('show');
}

function closeImageViewer() {
    document.getElementById('imageViewerModal').classList.remove('show');
}

// ========== LIVE LOCATION MANAGEMENT ==========
function checkLocationPermission() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }

    // Check if permission was previously denied
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') {
                startLiveLocationTracking();
                dismissLocationBanner();
            } else if (result.state === 'prompt') {
                showLocationBanner();
            } else {
                console.log('Location permission denied');
            }
        });
    } else {
        showLocationBanner();
    }
}

function showLocationBanner() {
    const banner = document.getElementById('locationBanner');
    if (banner) {
        banner.classList.add('show');
    }
}

function dismissLocationBanner() {
    const banner = document.getElementById('locationBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function requestLocationPermission() {
    startLiveLocationTracking();
}

function startLiveLocationTracking() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    // Show loading state
    const myLocationBtn = document.getElementById('myLocationBtn');
    if (myLocationBtn) {
        myLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    // Start watching position
    appState.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            appState.userLocation = { latitude, longitude };
            appState.locationPermissionGranted = true;

            // Update or create user location marker
            updateUserLocationMarker(latitude, longitude);

            // Hide banner
            dismissLocationBanner();

            // Reset button
            if (myLocationBtn) {
                myLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
                myLocationBtn.classList.add('active');
            }

            // Show success notification (only once)
            if (!appState.locationNotificationShown) {
                showLocationSuccess();
                appState.locationNotificationShown = true;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            if (myLocationBtn) {
                myLocationBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
                myLocationBtn.classList.remove('active');
            }

            if (error.code === error.PERMISSION_DENIED) {
                showError('Location access denied. Please enable location in your browser settings.');
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        }
    );
}

function updateUserLocationMarker(latitude, longitude) {
    if (!appState.map) return;

    // Remove existing marker if any
    if (appState.userMarker) {
        appState.map.removeLayer(appState.userMarker);
    }

    // Create pulsing marker for user location
    const userMarkerHTML = `
        <div class="user-location-marker">
            <div class="pulse"></div>
            <div class="marker-dot"></div>
        </div>
    `;

    appState.userMarker = L.marker([latitude, longitude], {
        icon: L.divIcon({
            html: userMarkerHTML,
            iconSize: [40, 40],
            className: 'user-marker-wrapper'
        })
    }).addTo(appState.map);

    // Reverse geocode to get location name
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                const addr = data.address;
                const fullDetail = [
                    addr.house_number || addr.building,
                    addr.road,
                    addr.suburb || addr.neighbourhood,
                    addr.city || addr.town || addr.village
                ].filter(Boolean).join(', ');

                const locationName = fullDetail || data.display_name;

                // Update popup with location name
                appState.userMarker.bindPopup(`
                    <div style="text-align: center; padding: 8px;">
                        <strong style="color: #2196f3;">📍 Your Location</strong><br>
                        <span style="font-size: 0.85rem; color: #666;">
                            ${locationName}
                        </span>
                    </div>
                `);

                // Auto-fill location in report form if empty
                const locationInput = document.getElementById('location');
                if (locationInput && !locationInput.value) {
                    locationInput.value = locationName;
                }
            }
        })
        .catch(error => {
            console.error('Reverse geocoding failed:', error);
            // Fallback to coordinates
            appState.userMarker.bindPopup(`
                <div style="text-align: center; padding: 8px;">
                    <strong style="color: #2196f3;">📍 Your Location</strong><br>
                    <span style="font-size: 0.85rem; color: #666;">
                        ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                    </span>
                </div>
            `);
        });
}

function centerMapOnUserLocation() {
    if (!appState.userLocation || !appState.map) {
        if (!appState.locationPermissionGranted) {
            startLiveLocationTracking();
        } else {
            showError('Location not available');
        }
        return;
    }

    // Animate to user location
    appState.map.setView(
        [appState.userLocation.latitude, appState.userLocation.longitude],
        15,
        { animate: true, duration: 1 }
    );

    // Open popup
    if (appState.userMarker) {
        appState.userMarker.openPopup();
    }
}

function showLocationSuccess() {
    const toast = document.createElement('div');
    toast.className = 'location-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Live location enabled</span>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== GEOLOCATION ==========
function getGeolocation() {
    const geoBtn = document.getElementById('geolocateBtn');

    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    geoBtn.disabled = true;
    geoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            appState.userLocation = { latitude, longitude };

            // Show loading state
            const coordsDisplay = document.getElementById('coordsDisplay');
            coordsDisplay.innerHTML = '📍 Fetching location name...';
            coordsDisplay.classList.add('show');

            // Reverse geocode to get readable location
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                .then(response => response.json())
                .then(data => {
                    const locationInput = document.getElementById('location');

                    // Format location name with full details
                    if (data.address) {
                        const addr = data.address;
                        const fullDetail = [
                            addr.house_number || addr.building,
                            addr.road,
                            addr.suburb || addr.neighbourhood,
                            addr.city || addr.town || addr.village,
                            addr.postcode
                        ].filter(Boolean).join(', ');

                        const locationName = fullDetail || data.display_name;
                        locationInput.value = locationName;

                        coordsDisplay.innerHTML = `📍 Full Address: ${locationName}<br><small>${latitude.toFixed(6)}, ${longitude.toFixed(6)}</small>`;
                    } else {
                        locationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        coordsDisplay.innerHTML = `📍 Location detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    }
                })
                .catch(error => {
                    console.error('Reverse geocoding failed:', error);
                    // Fallback to coordinates
                    const locationInput = document.getElementById('location');
                    locationInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    coordsDisplay.innerHTML = `📍 Location detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                })
                .finally(() => {
                    // Reset button
                    geoBtn.disabled = false;
                    geoBtn.innerHTML = '<i class="fas fa-location-dot"></i> Auto-Detect';
                });
        },
        (error) => {
            showError('Unable to get your location. Please enter it manually.');
            geoBtn.disabled = false;
            geoBtn.innerHTML = '<i class="fas fa-location-dot"></i> Auto-Detect';
            console.error('Geolocation error:', error);
        }
    );
}

// ========== FORM VALIDATION & ERRORS ==========
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'flex';
    successMsg.classList.add('show');

    // Generate reference number
    const refNumber = 'WG' + new Date().getFullYear() + String(appState.currentReportID - 1).padStart(6, '0');
    const submitTime = new Date().toLocaleString();

    // Update reference number and time
    const refNumberEl = document.getElementById('refNumber');
    const submitTimeEl = document.getElementById('submitTime');

    if (refNumberEl) refNumberEl.textContent = refNumber;
    if (submitTimeEl) submitTimeEl.textContent = submitTime;
}

// ========== MAP INITIALIZATION & MANAGEMENT ==========
function initializeMap() {
    // Initialize Leaflet map centered on Mumbai & Navi Mumbai
    appState.map = L.map('mapElement').setView([19.0760, 72.8777], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(appState.map);

    // Add markers for mock data
    appState.reports.forEach(report => {
        addMapMarker(report);
    });
}

function addMapMarker(report) {
    const { type, latitude, longitude, id } = report;

    // Determine marker color based on type
    let markerColor = '#ff9800'; // orange - construction
    if (type === 'dumping') markerColor = '#e74c3c'; // red
    if (type === 'sewage') markerColor = '#0277bd'; // blue

    // Create custom marker
    const markerHTML = `
        <div style="
            width: 30px;
            height: 30px;
            background-color: ${markerColor};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
        ">
            <i class="fas fa-map-pin" style="font-size: 14px;"></i>
        </div>
    `;

    const marker = L.marker([latitude, longitude], {
        icon: L.divIcon({
            html: markerHTML,
            iconSize: [30, 30],
            className: 'custom-marker'
        })
    }).addTo(appState.map);

    // Add popup on click
    marker.on('click', () => {
        showMarkerDetails(report);
    });

    appState.markers.push({ id, marker });
}

function showMarkerDetails(report) {
    const modal = document.getElementById('markerModal');
    const detailsDiv = document.getElementById('markerDetails');

    const statusColor = getStatusColor(report.status);
    const typeIcon = getTypeIcon(report.type);

    detailsDiv.innerHTML = `
        <div style="display: flex; align-items: start; gap: 16px; margin-bottom: 16px;">
            <div style="font-size: 2rem;">${typeIcon}</div>
            <div style="flex: 1;">
                <h3 style="margin-bottom: 8px; color: #2d5016;">${formatType(report.type)}</h3>
                <p style="color: #666; font-size: 0.9rem; margin: 0;">
                    Reported: ${formatDate(report.date)}
                </p>
            </div>
            <span style="
                background-color: ${statusColor};
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                white-space: nowrap;
            ">${formatStatus(report.status)}</span>
        </div>
        
        <p style="color: #1a1a1a; line-height: 1.6; margin-bottom: 16px;">
            ${report.description}
        </p>
        
        <div style="background-color: #f8faf6; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <p style="color: #666; font-size: 0.9rem; margin: 0;">
                <strong>Location:</strong> ${report.location}
            </p>
            <p style="color: #666; font-size: 0.9rem; margin: 8px 0 0 0;">
                <strong>Reported by:</strong> ${report.reporter}
            </p>
        </div>
        
        <div style="margin-bottom: 16px;">
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">
                <strong>Progress:</strong>
            </p>
            <div style="
                width: 100%;
                height: 8px;
                background-color: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            ">
                <div style="
                    width: ${report.progress}%;
                    height: 100%;
                    background: linear-gradient(90deg, #4a7c3b 0%, #7cb342 100%);
                    transition: width 0.3s ease;
                "></div>
            </div>
            <p style="color: #666; font-size: 0.85rem; margin-top: 8px; text-align: right;">
                ${report.progress}% complete
            </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button class="btn btn-secondary" style="padding: 10px 16px; font-size: 0.95rem;" onclick="document.getElementById('markerModal').classList.remove('show')">
                Close
            </button>
            <button class="btn btn-primary" style="padding: 10px 16px; font-size: 0.95rem;" onclick="openAuthorityDashboard()">
                Review Report
            </button>
        </div>
    `;

    modal.classList.add('show');
}

function openAuthorityDashboard() {
    document.getElementById('markerModal').classList.remove('show');
    document.getElementById('authority-dash').scrollIntoView({ behavior: 'smooth' });
}

// ========== CITIZEN DASHBOARD ==========
function renderCitizenDashboard() {
    const grid = document.getElementById('citizenReportsGrid');

    if (appState.reports.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No reports submitted yet.</p>';
        return;
    }

    grid.innerHTML = appState.reports.map(report => createReportCard(report)).join('');
}

function createReportCard(report) {
    const statusColor = getStatusColor(report.status);
    const typeIcon = getTypeIcon(report.type);

    return `
        <div class="report-card status-${report.status}">
            <div class="report-header">
                <div>
                    <div class="report-type-icon">${typeIcon}</div>
                    <div class="report-type">${formatType(report.type)}</div>
                    <div class="report-date">${formatDate(report.date)}</div>
                </div>
                <span class="status-badge status-${report.status}">
                    ${formatStatus(report.status)}
                </span>
            </div>
            <div class="report-body">
                <p class="report-description">${report.description.substring(0, 150)}${report.description.length > 150 ? '...' : ''}</p>
                <div class="report-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${report.location}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${report.progress}%"></div>
                </div>
                <p style="font-size: 0.85rem; color: #666; text-align: center;">
                    ${report.progress}% Complete
                </p>
            </div>
            <div class="report-footer">
                <span class="report-id">Report #${report.id}</span>
                <span style="font-size: 0.85rem; color: #666;">By ${report.reporter}</span>
            </div>
        </div>
    `;
}

function filterReports(filter) {
    const grid = document.getElementById('citizenReportsGrid');

    let filtered = appState.reports;
    if (filter !== 'all') {
        filtered = appState.reports.filter(r => r.status === filter);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No reports found for this filter.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(report => createReportCard(report)).join('');
}

// ========== AUTHORITY DASHBOARD ==========
function renderAuthorityDashboard() {
    const tbody = document.getElementById('tableBody');

    tbody.innerHTML = appState.reports.map((report, index) => `
        <tr>
            <td>#${report.id}</td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    ${getTypeIcon(report.type)}
                    ${formatType(report.type)}
                </span>
            </td>
            <td>${report.location}</td>
            <td>${formatDate(report.date)}</td>
            <td>
                <span class="status-badge status-${report.status}">
                    ${formatStatus(report.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.85rem;" 
                    onclick="openStatusModal(${report.id})">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

function applyAuthorityFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;

    const tbody = document.getElementById('tableBody');

    let filtered = appState.reports;

    if (statusFilter !== 'all') {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (typeFilter !== 'all') {
        filtered = filtered.filter(r => r.type === typeFilter);
    }

    tbody.innerHTML = filtered.map(report => `
        <tr>
            <td>#${report.id}</td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    ${getTypeIcon(report.type)}
                    ${formatType(report.type)}
                </span>
            </td>
            <td>${report.location}</td>
            <td>${formatDate(report.date)}</td>
            <td>
                <span class="status-badge status-${report.status}">
                    ${formatStatus(report.status)}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary" style="padding: 8px 12px; font-size: 0.85rem;" 
                    onclick="openStatusModal(${report.id})">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

// ========== STATUS UPDATE MODAL ==========
function openStatusModal(reportId) {
    appState.selectedReport = appState.reports.find(r => r.id === reportId);
    const modal = document.getElementById('statusModal');
    const select = document.getElementById('newStatus');
    select.value = appState.selectedReport.status;
    document.getElementById('statusComment').value = '';
    modal.classList.add('show');
}

function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('show');
}

function updateReportStatus() {
    if (!appState.selectedReport) return;

    const newStatus = document.getElementById('newStatus').value;
    const reportId = appState.selectedReport.id;

    // Update via API
    fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update status');
            return response.text().then(text => {
                if (!text) {
                    // If empty response, update locally
                    const report = appState.reports.find(r => r.id === reportId);
                    if (report) {
                        report.status = newStatus;
                        const progressMap = {
                            'reported': 15,
                            'review': 40,
                            'action': 75,
                            'resolved': 100
                        };
                        report.progress = progressMap[newStatus] || 10;
                    }
                    return report;
                }
                return JSON.parse(text);
            });
        })
        .then(updatedReport => {
            // Update local state
            const report = appState.reports.find(r => r.id === reportId);
            if (report) {
                report.status = updatedReport.status;
                report.progress = updatedReport.progress;
            }

            closeStatusModal();
            renderAuthorityDashboard();
            renderCitizenDashboard();
            updateDashboardStats();

            // Show success toast
            const toast = document.createElement('div');
            toast.textContent = '[SUCCESS] Status updated successfully';
            toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4caf50;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 2000;
            animation: slideUp 0.3s ease-out;
        `;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
        })
        .catch(error => {
            console.error('[ERROR] Error updating status:', error);
            showError('Failed to update report status');
        });
}

// ========== DASHBOARD STATS ==========
function updateDashboardStats() {
    // Citizen dashboard stats
    document.getElementById('totalReports').textContent = appState.reports.length;
    document.getElementById('reviewingReports').textContent = appState.reports.filter(r => r.status === 'review').length;
    document.getElementById('actionReports').textContent = appState.reports.filter(r => r.status === 'action').length;
    document.getElementById('resolvedReports').textContent = appState.reports.filter(r => r.status === 'resolved').length;

    // Authority dashboard stats
    document.getElementById('authTotalReports').textContent = appState.reports.filter(r => r.status === 'reported').length;
    document.getElementById('authResolvedReports').textContent = appState.reports.filter(r => r.status === 'resolved').length;
    document.getElementById('authInProgressReports').textContent = appState.reports.filter(r =>
        r.status === 'review' || r.status === 'action'
    ).length;
}

// ========== UTILITY FUNCTIONS ==========
function formatType(type) {
    const types = {
        'dumping': 'Illegal Dumping',
        'sewage': 'Sewage Discharge',
        'construction': 'Illegal Construction'
    };
    return types[type] || type;
}

function formatStatus(status) {
    const statuses = {
        'reported': 'Reported',
        'review': 'Under Review',
        'action': 'Action Taken',
        'resolved': 'Resolved'
    };
    return statuses[status] || status;
}

function getStatusColor(status) {
    const colors = {
        'reported': '#ff9800',
        'review': '#2196f3',
        'action': '#9c27b0',
        'resolved': '#4caf50'
    };
    return colors[status] || '#999';
}

function getTypeIcon(type) {
    const icons = {
        'dumping': '<i class="fas fa-trash" style="color: #e74c3c;"></i>',
        'sewage': '<i class="fas fa-water" style="color: #0277bd;"></i>',
        'construction': '<i class="fas fa-hard-hat" style="color: #ffc107;"></i>'
    };
    return icons[type] || '<i class="fas fa-flag"></i>';
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// ========== KEYBOARD SHORTCUTS & HELPERS ==========
document.addEventListener('keydown', (e) => {
    // Close modals with Escape
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Add smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Performance optimization: Lazy load heavy animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInLeft 1s ease-out';
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card').forEach(card => {
    observer.observe(card);
});

console.log('WetlandGuard: All event listeners initialized');
// ========================================
// ROLE-BASED ACCESS CONTROL
// ========================================

// Initialize role-based access
function initializeRoleBasedAccess() {
    const userRole = localStorage.getItem('userRole') || 'guest';
    const userEmail = localStorage.getItem('userEmail') || '';

    // Set body class for CSS-based role filtering
    document.body.className = document.body.className.replace(/\b(user|admin|worker)-role\b/g, '');
    document.body.classList.add(`${userRole}-role`);

    // Update navigation
    updateNavigation(userRole, userEmail);

    // Show/hide sections based on role
    updateVisibility(userRole);

    // Load role-specific data
    loadRoleSpecificData(userRole);
}

function updateNavigation(role, email) {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const roleLabel = document.getElementById('roleLabel');

    if (role !== 'guest') {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        userRoleDisplay.style.display = 'block';

        const roleNames = {
            'user': '👤 User',
            'admin': '👨‍💼 Admin',
            'worker': '🔧 Worker'
        };

        roleLabel.textContent = `${roleNames[role] || role} (${email})`;

        // Show role-specific nav items
        document.querySelectorAll('.role-user, .role-admin, .role-worker').forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll(`.role-${role}`).forEach(el => {
            el.style.display = el.tagName === 'LI' ? 'block' : 'block';
        });
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        userRoleDisplay.style.display = 'none';
    }
}

function updateVisibility(role) {
    // Hide all role-based sections first
    document.querySelectorAll('[class*="role-"]').forEach(el => {
        el.style.display = 'none';
    });

    // Show sections for current role
    if (role === 'user') {
        document.querySelectorAll('.role-user').forEach(el => {
            el.style.display = el.tagName === 'SECTION' ? 'block' : 'block';
        });
    } else if (role === 'admin') {
        document.querySelectorAll('.role-admin, .role-user').forEach(el => {
            el.style.display = el.tagName === 'SECTION' ? 'block' : 'block';
        });
    } else if (role === 'worker') {
        document.querySelectorAll('.role-worker').forEach(el => {
            el.style.display = el.tagName === 'SECTION' ? 'block' : 'block';
        });
    }
}

function loadRoleSpecificData(role) {
    if (role === 'worker') {
        const email = localStorage.getItem('userEmail');
        // Simple mapping for demo: worker email -> worker ID
        const workerId = email.includes('worker') ? 'W001' : 'W001';
        loadWorkerTasks(workerId);
    } else if (role === 'admin') {
        loadPhotoGallery();
        loadReportsForPhotoUpload();
    }
}

function logout(e) {
    e.preventDefault();
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// ========================================
// WORKER DASHBOARD FUNCTIONALITY
// ========================================

async function loadWorkerTasks(workerId = 'W001') {
    const grid = document.getElementById('workerTasksGrid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/workers/tasks/${workerId}`);
        const tasks = await response.json();

        // Update stats
        let assignedCount = 0, inProgressCount = 0, completedCount = 0;

        const taskHTML = tasks.map(task => {
            if (task.status === 'reported' || task.status === 'review') assignedCount++;
            if (task.status === 'action') inProgressCount++;
            if (task.status === 'resolved') completedCount++;

            return `
                <div class="worker-task-card" style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div class="task-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div class="task-id" style="font-weight: bold; color: #4a7c3b;">#R${task.id}</div>
                        <div class="task-status-badge ${task.status}" style="padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; background: ${getStatusColor(task.status)}; color: white;">${task.status.toUpperCase()}</div>
                    </div>
                    
                    <div class="task-report-info">
                        <h4 style="margin: 0 0 8px 0; color: #2d5016;">${formatType(task.type)} - ${task.location}</h4>
                        <div class="task-location" style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">
                            <i class="fas fa-map-marker-alt"></i> ${task.location}
                        </div>
                        <p style="margin: 8px 0; line-height: 1.4;"><strong>Description:</strong> ${task.description}</p>
                        <p style="margin: 8px 0;"><strong>Reporter:</strong> ${task.reporter}</p>
                    </div>
                    
                    <div class="task-dates" style="font-size: 0.85rem; color: #999; margin: 8px 0;">
                        <p>📅 Date: ${formatDate(task.date)}</p>
                    </div>
                    
                    <div class="task-photo-box" onclick="openPhotoUpload('${task.id}')" style="background: #f8faf6; border: 2px dashed #4a7c3b; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; margin: 12px 0;">
                        <i class="fas fa-camera" style="font-size: 1.5rem; color: #4a7c3b; margin-bottom: 8px;"></i>
                        <p style="margin: 0; color: #4a7c3b; font-weight: 600;">Upload Progress Photos</p>
                    </div>
                    
                    <div class="task-actions" style="display: flex; gap: 8px; margin-top: 16px;">
                        <button class="btn btn-secondary btn-sm" onclick="viewTaskDetails('${task.id}')" style="flex: 1; padding: 8px 12px; font-size: 0.9rem;">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        ${task.status !== 'action' && task.status !== 'resolved' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateTaskStatus('${task.id}', 'action')" style="flex: 1; padding: 8px 12px; font-size: 0.9rem;">
                                <i class="fas fa-play"></i> Start Action
                            </button>
                        ` : ''}
                        ${task.status === 'action' ? `
                            <button class="btn btn-primary btn-sm" onclick="updateTaskStatus('${task.id}', 'resolved')" style="flex: 1; padding: 8px 12px; font-size: 0.9rem; background: #4caf50;">
                                <i class="fas fa-check"></i> Complete
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = taskHTML || '<p style="text-align: center; padding: 40px; color: #666;">No tasks assigned to you yet.</p>';

        // Update stats
        const assignedEl = document.getElementById('assignedTasks');
        const inProgressEl = document.getElementById('inProgressTasks');
        const completedEl = document.getElementById('completedTasks');
        
        if (assignedEl) assignedEl.textContent = assignedCount;
        if (inProgressEl) inProgressEl.textContent = inProgressCount;
        if (completedEl) completedEl.textContent = completedCount;
        
    } catch (error) {
        console.error("Failed to load tasks", error);
        if (grid) {
            grid.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">Failed to load tasks. Please check if the server is running.</p>';
        }
    }
}

async function updateTaskStatus(reportId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            const email = localStorage.getItem('userEmail');
            loadWorkerTasks(email.includes('worker') ? 'W001' : 'W001');
            showNotification(`Status updated to ${newStatus}!`);
        }
    } catch (error) {
        showError("Failed to update task status");
    }
}

function viewTaskDetails(taskId) {
    // Similar to showMarkerDetails but for worker context
    fetch(`${API_BASE_URL}/reports/${taskId}`)
        .then(r => r.json())
        .then(report => {
            alert(`Task Details:\n\nType: ${report.type}\nLocation: ${report.location}\nDescription: ${report.description}\nReporter: ${report.reporter}`);
        });
}

// ========================================
// PHOTO UPLOAD & GALLERY FUNCTIONALITY
// ========================================

async function loadPhotoGallery() {
    const gallery = document.getElementById('photoGallery');
    if (!gallery) return;

    try {
        const response = await fetch(`${API_BASE_URL}/photos`);
        const pairs = await response.json();

        const galleryHTML = pairs.map(pair => `
            <div class="photo-pair-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div class="photo-comparison-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;">
                    <div class="photo-frame" style="position: relative; aspect-ratio: 4/3; overflow: hidden;">
                        <span class="photo-label before" style="position: absolute; top: 8px; left: 8px; background: rgba(231, 76, 60, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; z-index: 2;">BEFORE</span>
                        <img src="${pair.before_photo || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23eee%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22%3ENo Photo%3C/text%3E%3C/svg%3E'}" alt="Before restoration" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="photo-frame" style="position: relative; aspect-ratio: 4/3; overflow: hidden;">
                        <span class="photo-label after" style="position: absolute; top: 8px; left: 8px; background: rgba(76, 175, 80, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; z-index: 2;">AFTER</span>
                        <img src="${pair.after_photo || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23eee%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23aaa%22%3ENo Photo%3C/text%3E%3C/svg%3E'}" alt="After restoration" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
                <div class="photo-card-info" style="padding: 16px;">
                    <div class="photo-card-title" style="font-weight: bold; color: #4a7c3b; margin-bottom: 4px;">Report #${pair.report_id}</div>
                    <div class="photo-card-date" style="color: #666; font-size: 0.9rem; margin-bottom: 8px;">${formatDate(pair.date)}</div>
                    <div class="photo-card-description" style="color: #333; line-height: 1.4; margin-bottom: 8px;">${pair.description}</div>
                    <div class="photo-card-impact" style="color: #4caf50; font-weight: 600;">
                        <i class="fas fa-check-circle"></i> ${pair.impact}
                    </div>
                </div>
            </div>
        `).join('');

        gallery.innerHTML = galleryHTML || '<p style="text-align: center; padding: 40px; color: #666;">No restoration photos uploaded yet.</p>';
    } catch (error) {
        console.error("Gallery failed to load", error);
        if (gallery) {
            gallery.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">Failed to load photo gallery. Please check if the server is running.</p>';
        }
    }
}

function loadReportsForPhotoUpload() {
    fetch(`${API_BASE_URL}/reports`)
        .then(r => r.json())
        .then(reports => {
            const select = document.getElementById('reportSelect');
            if (select) {
                const options = reports.map(report =>
                    `<option value="${report.id}">#${report.id} - ${report.description.substring(0, 40)}...</option>`
                ).join('');

                if (options) {
                    select.innerHTML = '<option value="">-- Choose a report --</option>' + options;
                }
            }
        })
        .catch(e => console.error('Failed to load reports:', e));
}

// Add event listeners for photo inputs
document.addEventListener('DOMContentLoaded', () => {
    const beforePhoto = document.getElementById('beforePhoto');
    const afterPhoto = document.getElementById('afterPhoto');
    
    if (beforePhoto) {
        beforePhoto.addEventListener('change', (e) => previewPhoto(e, 'beforePreview'));
    }
    
    if (afterPhoto) {
        afterPhoto.addEventListener('change', (e) => previewPhoto(e, 'afterPreview'));
    }
});

function openPhotoUpload(taskId = null) {
    const modal = document.getElementById('photoUploadModal');
    modal.style.display = 'flex';
    modal.classList.add('active');

    // If taskId is provided, select it in the dropdown
    if (taskId) {
        setTimeout(() => {
            const select = document.getElementById('reportSelect');
            if (select) select.value = taskId;
        }, 500);
    }

    // Reset previews
    document.getElementById('beforePreview').innerHTML = '';
    document.getElementById('afterPreview').innerHTML = '';
    document.getElementById('date').valueAsDate = new Date();
}

// ... the rest of existing preview functions ...
function previewPhoto(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('photoUploadForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const reportID = document.getElementById('reportSelect').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    const beforeImg = document.getElementById('beforePreview').querySelector('img')?.src || '';
    const afterImg = document.getElementById('afterPreview').querySelector('img')?.src || '';

    if (!reportID || !description || !date) {
        alert('Please fill all required fields');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                report_id: parseInt(reportID),
                before_photo: beforeImg,
                after_photo: afterImg,
                description: description,
                date: date,
                impact: 'Wetland area restoration completed'
            })
        });

        if (response.ok) {
            loadPhotoGallery();
            closePhotoUpload();
            showNotification('Restoration photos saved successfully! 🌳');
            
            // Reset form
            document.getElementById('photoUploadForm').reset();
            document.getElementById('beforePreview').innerHTML = '';
            document.getElementById('afterPreview').innerHTML = '';
        } else {
            throw new Error('Failed to upload photos');
        }
    } catch (error) {
        console.error('Photo upload error:', error);
        showError("Failed to upload photos. Please try again.");
    }
});

function closePhotoUpload() {
    const modal = document.getElementById('photoUploadModal');
    modal.style.display = 'none';
    modal.classList.remove('active');
}

function previewPhoto(event, previewId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('photoUploadForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const reportID = document.getElementById('reportSelect').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (!reportID || !description || !date) {
        alert('Please fill all fields');
        return;
    }

    // Create new photo pair
    const newPair = {
        id: `P${Date.now()}`,
        reportID: parseInt(reportID),
        reportType: 'Restoration',
        location: 'Field Location',
        beforePhoto: document.getElementById('beforePreview').innerHTML.includes('img') ?
            document.getElementById('beforePreview').querySelector('img').src : '',
        afterPhoto: document.getElementById('afterPreview').innerHTML.includes('img') ?
            document.getElementById('afterPreview').querySelector('img').src : '',
        date: new Date(date),
        description: description,
        impact: 'Wetland restoration in progress'
    };

    photoState.beforeAfterPairs.push(newPair);
    loadPhotoGallery();
    closePhotoUpload();
    showNotification('Photos uploaded successfully! 🎉');
});

function getTypeColor(type) {
    const colors = {
        'dumping': '#ff9800',
        'sewage': '#2196f3',
        'construction': '#9c27b0'
    };
    return colors[type] || '#666';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDownFade 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize role-based access on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeRoleBasedAccess();
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        initializeChatbot();
    }, 500);
});

// ========================================
// ADVANCED CHATBOT LOGIC
// ========================================
function initializeChatbot() {
    console.log('[CHATBOT] Initializing chatbot...');
    
    const toggle = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input-field');
    const messages = document.getElementById('chatbot-messages');

    if (!toggle) {
        console.error('[CHATBOT] Toggle button not found!');
        return;
    }

    if (!windowEl || !close || !send || !input || !messages) {
        console.error('[CHATBOT] Missing chatbot elements:', {
            window: !!windowEl,
            close: !!close,
            send: !!send,
            input: !!input,
            messages: !!messages
        });
        return;
    }

    console.log('[CHATBOT] All elements found, setting up event listeners...');

    toggle.addEventListener('click', () => {
        console.log('[CHATBOT] Toggle clicked');
        windowEl.classList.toggle('active');
        if (windowEl.classList.contains('active')) {
            input.focus();
            console.log('[CHATBOT] Window opened');
        } else {
            console.log('[CHATBOT] Window closed');
        }
    });

    close.addEventListener('click', () => {
        console.log('[CHATBOT] Close button clicked');
        windowEl.classList.remove('active');
    });

    function addMessage(text, isBot = true) {
        console.log(`[CHATBOT] Adding message: ${isBot ? 'Bot' : 'User'} - ${text.substring(0, 50)}...`);
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        msgDiv.textContent = text;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        console.log(`[CHATBOT] Sending message: ${text}`);
        addMessage(text, false);
        input.value = '';

        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'message bot-message typing';
        typing.innerHTML = '<i class="fas fa-circle"></i><i class="fas fa-circle"></i><i class="fas fa-circle"></i>';
        typing.style.cssText = 'animation: pulse 1.5s infinite;';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        try {
            console.log(`[CHATBOT] Making API request to: ${API_BASE_URL}/chat`);
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text, 
                    user_id: localStorage.getItem('userEmail') || 'guest' 
                })
            });

            console.log(`[CHATBOT] API response status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[CHATBOT] API response received:', data);
            
            messages.removeChild(typing);
            addMessage(data.reply);
        } catch (error) {
            console.error('[CHATBOT] Error:', error);
            messages.removeChild(typing);
            
            let errorMessage = "I'm having trouble connecting right now. ";
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += "Please make sure the server is running (run start-server.bat) and try again!";
            } else {
                errorMessage += "Please try again in a moment!";
            }
            
            addMessage(errorMessage);
        }
    }

    send.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });

    console.log('[CHATBOT] Initialization complete!');
    
    // Add welcome message after a short delay
    setTimeout(() => {
        addMessage("Hello! I'm your WetlandGuard assistant. I can help you report violations, track status, learn about wetlands, and more. How can I help you today? 🌿");
    }, 1000);
}
