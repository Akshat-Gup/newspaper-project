// Initialize date
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    setupEventListeners();
});

function updateDate() {
    const dateElement = document.getElementById('current-date');
    const footerYear = document.getElementById('footer-year');
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    footerYear.textContent = now.getFullYear();
}

function setupEventListeners() {
    // File input handler
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-btn');
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileName.textContent = e.target.files[0].name;
            generateBtn.disabled = false;
        } else {
            fileName.textContent = 'No file chosen';
            generateBtn.disabled = true;
        }
    });
    
    // Generate article button
    generateBtn.addEventListener('click', generateArticle);
    
    // Style tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            changeTheme(e.target.dataset.style);
        });
    });
    
    // Action buttons
    document.getElementById('share-btn').addEventListener('click', shareArticle);
    document.getElementById('print-btn').addEventListener('click', printArticle);
    document.getElementById('new-article-btn').addEventListener('click', createNewArticle);
}

function changeTheme(style) {
    document.body.className = '';
    
    switch(style) {
        case 'classic':
            document.body.classList.add('classic-theme');
            break;
        case 'modern':
            document.body.classList.add('modern-theme');
            break;
        case 'tabloid':
            document.body.classList.add('tabloid-theme');
            break;
        default:
            // nytimes is default
            break;
    }
}

async function generateArticle() {
    const fileInput = document.getElementById('file-input');
    const loading = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    const activeTab = document.querySelector('.tab-btn.active');
    const style = activeTab.dataset.style;
    
    if (!fileInput.files[0]) {
        alert('Please select a file first');
        return;
    }
    
    // Show loading
    loading.style.display = 'block';
    generateBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('userFile', fileInput.files[0]);
    formData.append('style', getStyleName(style));
    
    try {
        const response = await fetch('/generate-article', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate article');
        }
        
        const data = await response.json();
        displayArticle(data.article);
        
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Error generating article. Please try again.';
        
        // Check if we have error details from the server
        if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage + '\n\nNote: Make sure you have set your OPENAI_API_KEY in the .env file.');
    } finally {
        loading.style.display = 'none';
        generateBtn.disabled = false;
    }
}

function getStyleName(style) {
    const styleNames = {
        'nytimes': 'New York Times',
        'classic': 'Classic Newspaper',
        'modern': 'Modern Magazine',
        'tabloid': 'Tabloid'
    };
    return styleNames[style] || 'New York Times';
}

function displayArticle(articleText) {
    const articleSection = document.getElementById('article-section');
    const generatedContent = document.getElementById('generated-content');
    
    // Parse the article text into headline, subheading, and body
    const lines = articleText.split('\n').filter(line => line.trim());
    
    // Maximum length for a subheading (short, descriptive line)
    const MAX_SUBHEADING_LENGTH = 100;
    
    let headline = '';
    let subheading = '';
    let body = [];
    
    if (lines.length > 0) {
        headline = lines[0];
        if (lines.length > 1) {
            // Check if second line looks like a subheading (shorter, different style)
            if (lines[1].length < MAX_SUBHEADING_LENGTH) {
                subheading = lines[1];
                body = lines.slice(2);
            } else {
                body = lines.slice(1);
            }
        }
    }
    
    // Build HTML
    let html = '';
    if (headline) {
        html += `<h2>${headline}</h2>`;
    }
    if (subheading) {
        html += `<h3>${subheading}</h3>`;
    }
    
    body.forEach(paragraph => {
        if (paragraph.trim()) {
            html += `<p>${paragraph}</p>`;
        }
    });
    
    generatedContent.innerHTML = html;
    
    // Scroll to article and show it
    articleSection.style.display = 'block';
    articleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function shareArticle() {
    const articleContent = document.getElementById('generated-content').innerText;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Personal Newspaper Article',
            text: articleContent
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(articleContent).then(() => {
            alert('Article copied to clipboard! You can now share it anywhere.');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Unable to copy article. Please select and copy the text manually.');
        });
    }
}

function printArticle() {
    window.print();
}

function createNewArticle() {
    // Reset the form
    document.getElementById('file-input').value = '';
    document.getElementById('file-name').textContent = 'No file chosen';
    document.getElementById('generate-btn').disabled = true;
    document.getElementById('article-section').style.display = 'none';
    
    // Scroll back to upload section
    document.getElementById('upload-area').scrollIntoView({ behavior: 'smooth' });
}
