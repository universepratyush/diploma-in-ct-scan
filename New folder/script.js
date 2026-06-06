// Generate lecture data structure with external links
const generatePDFData = () => {
    const pdfs = [];

    // Left Column: external links for Lecture 1-200
    for (let i = 1; i <= 200; i++) {
        pdfs.push({
            id: i,
            number: i,
            label: `Lecture ${i}`,
            link: `https://drive.google.com/file/d/example-lecture-${i}/view?usp=sharing`,
            column: 'left'
        });
    }

    // Right Column: external links for Lecture 201-300
    for (let i = 201; i <= 300; i++) {
        const lectureNumber = i - 200; // 1-100 for labeling
        pdfs.push({
            id: i,
            number: i,
            label: `Lecture ${lectureNumber}`,
            link: `https://drive.google.com/file/d/example-lecture-${i}/view?usp=sharing`,
            column: 'right'
        });
    }

    return pdfs;
};

const isVisible = (element) => {
    return element.style.display !== 'none' && window.getComputedStyle(element).display !== 'none';
};

const updateSearchInfo = () => {
    const allLinks = Array.from(document.querySelectorAll('.pdf-link'));
    const visibleCount = allLinks.filter(isVisible).length;
    const totalCount = allLinks.length;
    const searchInfoCount = document.getElementById('searchInfoCount');

    if (!searchInfoCount) return;

    searchInfoCount.textContent = visibleCount === totalCount
        ? `Showing all ${totalCount} lectures`
        : `${visibleCount} lectures found`;
};

// Create PDF link elements
const createPDFLink = (pdfData, delay = 0) => {
    const linkElement = document.createElement('a');
    linkElement.href = pdfData.link;
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = `
        block px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 hover:text-white hover:bg-blue-500
        transition-colors duration-200 text-sm font-medium border border-transparent hover:border-blue-500 cursor-pointer pdf-link animate-fade-in
    `;
    linkElement.style.animationDelay = `${delay}ms`;
    linkElement.setAttribute('data-search', `${pdfData.label.toLowerCase()} ${pdfData.link}`);
    linkElement.setAttribute('data-lecture-num', pdfData.number);
    linkElement.innerHTML = `
        <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V3z"/>
                <path d="M9 7h2v6H9V7zm-2-2h6M7 15h6" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>${pdfData.label}</span>
        </span>
    `;
    linkElement.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Opening ${pdfData.label} (${pdfData.link})`);
        // Uncomment below to actually open the presentation in a new tab
        // window.open(pdfData.link, '_blank');
    });
    return linkElement;
};

// Populate columns with PDF links
const populateColumns = (pdfData) => {
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');

    // Clear existing content
    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';

    // Populate left column (PDFs 1-200)
    const leftPDFs = pdfData.filter(pdf => pdf.column === 'left');
    leftPDFs.forEach((pdf, index) => {
        leftColumn.appendChild(createPDFLink(pdf, index * 25));
    });

    // Populate right column (PDFs 201-300)
    const rightPDFs = pdfData.filter(pdf => pdf.column === 'right');
    rightPDFs.forEach((pdf, index) => {
        rightColumn.appendChild(createPDFLink(pdf, index * 25));
    });
};

// Search functionality
const setupSearch = () => {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const allLinks = document.querySelectorAll('.pdf-link');

        if (searchTerm === '') {
            allLinks.forEach(link => {
                link.style.display = 'block';
            });
        } else {
            allLinks.forEach(link => {
                const searchData = link.getAttribute('data-search').toLowerCase();
                const lectureNum = link.getAttribute('data-lecture-num');
                const matches = searchData.includes(searchTerm) || lectureNum.includes(searchTerm);
                link.style.display = matches ? 'block' : 'none';
            });
        }

        updateEmptyStates();
        updateSearchInfo();
    });
};

const updateEmptyStates = () => {
    const updateColumnState = (columnId) => {
        const column = document.getElementById(columnId);
        const visibleItems = Array.from(column.querySelectorAll('.pdf-link')).filter(isVisible);
        const existingEmpty = column.querySelector('.empty-state');

        if (visibleItems.length === 0 && column.querySelectorAll('.pdf-link').length > 0) {
            if (!existingEmpty) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'empty-state text-center text-gray-400 dark:text-slate-400 py-4';
                emptyMsg.textContent = 'No lectures found';
                column.appendChild(emptyMsg);
            }
        } else if (existingEmpty) {
            existingEmpty.remove();
        }
    };

    updateColumnState('leftColumn');
    updateColumnState('rightColumn');
};

const setupThemeToggle = () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeToggleIcon = document.getElementById('themeToggleIcon');
    const themeToggleText = document.getElementById('themeToggleText');

    const setTheme = (mode) => {
        const root = document.documentElement;
        if (mode === 'dark') {
            root.classList.add('dark');
            themeToggleIcon.textContent = '☀️';
            themeToggleText.textContent = 'Light mode';
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            themeToggleIcon.textContent = '🌙';
            themeToggleText.textContent = 'Dark mode';
            localStorage.setItem('theme', 'light');
        }
    };

    const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(storedTheme);

    themeToggleBtn.addEventListener('click', () => {
        setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
    });
};

const setupBackToTop = () => {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.remove('hidden');
        } else {
            backToTop.classList.add('hidden');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const pdfData = generatePDFData();
    populateColumns(pdfData);
    setupSearch();
    setupThemeToggle();
    setupBackToTop();
    updateEmptyStates();
    updateSearchInfo();
});