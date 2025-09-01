// Smooth loading transitions
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth page transition class
    document.body.classList.add('page-transition', 'loaded');
    
    // Stagger card animations for better visual effect
    const cards = document.querySelectorAll('.listing-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add loading state management for navigation
    const navLinks = document.querySelectorAll('a[href^="/listings"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add fade out effect before navigation
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';
        });
    });
    const filterButtons = document.querySelectorAll('.filter');
    
    // Function to set active filter based on current URL
    function setActiveFilter() {
        const currentPath = window.location.pathname;
        
        // Remove active class from all buttons first
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        if (currentPath === '/listings') {
            // Set Trending as active for main listings page
            const trendingButton = Array.from(filterButtons).find(btn => 
                btn.querySelector('p').textContent.trim() === 'Trending'
            );
            if (trendingButton) {
                trendingButton.classList.add('active');
            }
        } else if (currentPath.startsWith('/listings/category/')) {
            // Extract category from URL and set corresponding button as active
            const category = decodeURIComponent(currentPath.split('/listings/category/')[1]);
            const activeButton = Array.from(filterButtons).find(btn => 
                btn.querySelector('p').textContent.trim() === category
            );
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
    
    // Set active filter on page load
    setActiveFilter();
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categoryText = this.querySelector('p').textContent.trim();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show loading state
            showLoadingState();
            
            // Make AJAX request
            if (categoryText === 'Trending') {
                fetchFilteredListings('all');
            } else {
                fetchFilteredListings(encodeURIComponent(categoryText));
            }
        });
    });

// Function to show loading state
function showLoadingState() {
    const listingsContainer = document.querySelector('.row');
    if (listingsContainer) {
        // Add loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.id = 'loading-spinner';
        loadingSpinner.className = 'text-center my-5';
        loadingSpinner.innerHTML = `
            <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading listings...</p>
        `;
        
        // Fade out current content
        listingsContainer.style.transition = 'opacity 0.3s ease';
        listingsContainer.style.opacity = '0.3';
        listingsContainer.style.pointerEvents = 'none';
        
        // Add spinner after a brief delay
        setTimeout(() => {
            if (!document.getElementById('loading-spinner')) {
                listingsContainer.appendChild(loadingSpinner);
            }
        }, 150);
    }
}

// Function to hide loading state
function hideLoadingState() {
    const listingsContainer = document.querySelector('.row');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
    
    if (listingsContainer) {
        listingsContainer.style.transition = 'opacity 0.4s ease';
        listingsContainer.style.opacity = '1';
        listingsContainer.style.pointerEvents = 'auto';
    }
}

// Function to fetch filtered listings via AJAX
async function fetchFilteredListings(category) {
    try {
        const url = category === 'all' ? '/listings/api/all' : `/listings/api/filter/${category}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            renderListings(data.listings);
            // Update URL without page reload
            const newUrl = category === 'all' ? '/listings' : `/listings/category/${category}`;
            window.history.pushState({ category }, '', newUrl);
        } else {
            showErrorMessage('Failed to load listings: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network error:', error);
        showErrorMessage('Network error: Unable to load listings. Please check your connection and try again.');
    } finally {
        hideLoadingState();
    }
}

// Function to show error messages
function showErrorMessage(message) {
    const listingsContainer = document.querySelector('.row');
    if (listingsContainer) {
        listingsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle mb-2"></i>
                    <h5>Oops! Something went wrong</h5>
                    <p class="mb-0">${message}</p>
                    <button class="btn btn-outline-danger mt-2" onclick="location.reload()">Refresh Page</button>
                </div>
            </div>
        `;
    }
}

// Function to render listings in the DOM
function renderListings(listings) {
    const listingsContainer = document.querySelector('.row');
    if (!listingsContainer) return;
    
    // Clear existing listings
    listingsContainer.innerHTML = '';
    
    if (listings.length === 0) {
        listingsContainer.innerHTML = '<div class="col-12"><p class="text-center">No listings found for this category.</p></div>';
        return;
    }
    
    // Render each listing
    listings.forEach((listing, index) => {
        const listingCard = createListingCard(listing, index);
        listingsContainer.appendChild(listingCard);
    });
}

// Function to create a listing card element
function createListingCard(listing, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 col-sm-6 mb-3';
    
    col.innerHTML = `
        <div class="card listing-card" style="animation-delay: ${index * 0.1}s">
            <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 20rem">
            <div class="card-body">
                <p class="card-text">
                    <b>${listing.title}</b> <br>
                    ${listing.description}
                </p>
                <p class="card-text">&#8377; ${listing.price.toLocaleString("en-IN")} / night</p>
                <a href="/listings/${listing._id}" class="btn btn-dark">More Info</a>
            </div>
        </div>
    `;
    
    return col;
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.category) {
        const category = event.state.category;
        // Update active filter button
        updateActiveFilter(category);
        // Fetch listings for the category
        showLoadingState();
        fetchFilteredListings(category);
    } else {
        // Default to all listings
        updateActiveFilter('all');
        showLoadingState();
        fetchFilteredListings('all');
    }
});

// Function to update active filter button based on category
function updateActiveFilter(category) {
    const filterButtons = document.querySelectorAll('.filter');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const buttonCategory = btn.getAttribute('data-filter') || 
                              (btn.querySelector('p') ? btn.querySelector('p').textContent.trim() : '');
        
        if ((category === 'all' && (buttonCategory === 'all' || buttonCategory === 'Trending')) ||
            (category !== 'all' && buttonCategory === category)) {
            btn.classList.add('active');
        }
    });
}
    
    // Search functionality
    const searchForm = document.querySelector('form[role="search"]');
    const searchInput = document.querySelector('input[name="q"]');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            const searchQuery = searchInput.value.trim();
            
            // If search is empty, prevent submission and show all listings
            if (searchQuery === '') {
                e.preventDefault();
                window.location.href = '/listings';
                return;
            }
            
            // Form will submit normally to /listings/search with the query
        });
        
        // Clear search and show all listings when input is cleared
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Escape' || (e.key === 'Backspace' && this.value === '')) {
                this.value = '';
                window.location.href = '/listings';
            }
        });
    }
});

// Tax switch functionality (existing)
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info");
        for (info of taxInfo) {
            if (info.style.display != "inline") {
                info.style.display = "inline";
            } else {
                info.style.display = "none";
            }
        }
    });
}